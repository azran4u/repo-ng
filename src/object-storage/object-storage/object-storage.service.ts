import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Lesson } from "../../model/lesson";
import { RabbiEnum } from "../../model/rabi.enum";
import { Snapshot } from "../../model/snapshot";
import { NotificationsService } from "../../telegram/notifications/notifications.service";
import serialize from "serialize-javascript";
import * as _ from "lodash";
@Injectable()
export class ObjectStorageService {
  private connectionString: string;
  private containerName: string;
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private telegramService: NotificationsService
  ) {
    this.logger.info(`LessonsPersistencyService constructor`);
    this.connectionString = this.configService.get(
      "objectStorage.connectionString",
      { infer: true }
    );
    if (!this.connectionString)
      throw new Error(`please set OBJECT_STORAGE_CONNECTION_STRING`);
    this.containerName = this.configService.get("objectStorage.containerName", {
      infer: true,
    });
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      this.connectionString
    );
    this.containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
  }

  async storeSnapshot(snapshot: Snapshot) {
    const content = serialize(snapshot.lessons);
    const blobName = this.snapshotToBlobName(snapshot);
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    try {
      await blockBlobClient.upload(content, Buffer.byteLength(content));
    } catch (error) {
      throw new Error(
        `uploading blob ${blobName} to object storage failed ${error}`
      );
    }
    try {
      await this.garbageCollector();
    } catch (error) {
      throw new Error(`object storage garbage collector failed ${error}`);
    }
  }

  async getRabbiLastSnapshot(rabbi: RabbiEnum): Promise<Snapshot> {
    const initialSnapshot: Snapshot = {
      rabbi: rabbi,
      date: new Date(0),
      lessons: [],
    };
    const snapshots = await this.getAllSnapshots();
    const rabbiSnapshots = snapshots.filter(
      (snapshot) => snapshot.rabbi === rabbi
    );
    if (_.isEmpty(rabbiSnapshots)) {
      return initialSnapshot;
    }
    const lastSnapshot = rabbiSnapshots.reduce((prev, curr) => {
      if (curr.date.getTime() > prev.date.getTime())
        return { rabbi: rabbi, date: curr.date, lessons: prev.lessons };
    }, initialSnapshot);

    const blobName = this.snapshotToBlobName(lastSnapshot);
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    let buffer: Buffer;
    try {
      buffer = await blockBlobClient.downloadToBuffer();
    } catch (error) {
      throw new Error(`downloading blob ${blobName} failed ${error}`);
    }
    let lessons: Lesson[];
    try {
      lessons = this.deserialize(buffer.toString());
    } catch (error) {
      throw new Error(`parsing blob content has failed ${error}`);
    }
    return { ...lastSnapshot, lessons };
  }

  public async garbageCollector() {
    const snapshots = await this.getAllSnapshots();
    for (let rabbi of Object.values(RabbiEnum)) {
      const rabbiLastSnapshot = await this.getRabbiLastSnapshot(rabbi);
      const snapshotsToDelete = snapshots.filter(
        (snapshot) =>
          snapshot.rabbi === rabbi &&
          snapshot.date.getTime() !== rabbiLastSnapshot.date.getTime()
      );
      for (let snapshot of snapshotsToDelete) {
        const blobName = this.snapshotToBlobName(snapshot);
        const blockBlobClient = this.containerClient.getBlobClient(blobName);
        try {
          await blockBlobClient.deleteIfExists();
        } catch (error) {
          throw new Error(`deletion of blob ${blobName} failed ${error}`);
        }
      }
      const message = `garbage collector deleted ${snapshotsToDelete.length} snapshots for rabbi ${rabbi}`;
      this.logger.info(message);
      await this.telegramService.sendMessage(message);
    }
  }

  private async getAllSnapshots() {
    const blobs = await this.listObjects();
    const snapshots = blobs.map((blob) => this.blobNameToSnapshot(blob));
    return snapshots;
  }
  private async listObjects(): Promise<string[]> {
    const res: string[] = [];
    let iter = this.containerClient.listBlobsFlat();
    try {
      for await (const blob of iter) {
        res.push(blob.name);
      }
    } catch (error) {
      throw new Error(
        `list container objects ${this.containerClient.containerName} failed ${error}`
      );
    }
    return res;
  }

  private snapshotToBlobName(snapshot: Snapshot): string {
    return `${snapshot.rabbi};;${snapshot.date.getTime()}`;
  }

  private blobNameToSnapshot(blobName: string): Snapshot {
    const res = blobName.split(";;");
    if (res.length !== 2) throw new Error(`blob name ${blobName} is invalid`);
    const [rabbi, time] = res;
    return {
      rabbi: RabbiEnum[rabbi],
      date: new Date(+time),
      lessons: [],
    };
  }

  private deserialize(serializedJavascript: string) {
    return eval("(" + serializedJavascript + ")");
  }
}
