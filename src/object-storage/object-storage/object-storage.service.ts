import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class ObjectStorageService {
  private accountName: string;
  private connectionString: string;
  private key: string;
  private containerName: string;
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
  ) {
    this.logger.info(`LessonsPersistencyService constructor`);
    this.accountName = this.configService.get("objectStorage.accountName", {
      infer: true,
    });
    this.connectionString = this.configService.get(
      "objectStorage.connectionString",
      { infer: true }
    );
    this.key = this.configService.get("objectStorage.key", { infer: true });
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

  async listObjects(): Promise<string[]> {
    const res: string[] = [];
    let iter = this.containerClient.listBlobsFlat();
    for await (const blob of iter) {
      res.push(blob.name);
    }
    return res;
  }
}
