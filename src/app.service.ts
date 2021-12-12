import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { ObjectStorageService } from "./object-storage/object-storage/object-storage.service";
import { LessonsScraperService } from "./scrap/lessons-scraper/lessons-scraper.service";

@Injectable()
export class AppService {
  constructor(
    private lessonsScraperService: LessonsScraperService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private objectStorgaeService: ObjectStorageService
  ) {
    this.logger.info(`AppService constructor`);
  }

  async start() {
    try {
      this.logger.info(`start scrapController`);
      const lessons = await this.objectStorgaeService.listObjects();
      this.logger.info(lessons);
      // await this.lessonsScraperService.scrapController();
    } catch (error) {
      this.logger.error(`cannot start scrap controller ${error}`);
      process.exit();
    }
  }
}
