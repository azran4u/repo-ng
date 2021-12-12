import { Module } from "@nestjs/common";
import { ObjectStorageModule } from "../object-storage/object-storage.module";
import { TelegramModule } from "../telegram/telegram.module";
import { BrowserService } from "./browser/browser.service";
import { LessonsScraperService } from "./lessons-scraper/lessons-scraper.service";

@Module({
  imports: [TelegramModule, ObjectStorageModule],
  providers: [BrowserService, LessonsScraperService],
  exports: [LessonsScraperService],
})
export class ScrapModule {}
