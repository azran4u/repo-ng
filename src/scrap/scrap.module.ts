import { Module } from "@nestjs/common";
import { TelegramModule } from "../telegram/telegram.module";
import { BrowserService } from "./browser/browser.service";
import { LessonsPersistencyService } from "./lessons-persistency/lessons-persistency.service";
import { LessonsScraperService } from "./lessons-scraper/lessons-scraper.service";

@Module({
  imports: [TelegramModule],
  providers: [BrowserService, LessonsPersistencyService, LessonsScraperService],
  exports: [LessonsScraperService],
})
export class ScrapModule {}
