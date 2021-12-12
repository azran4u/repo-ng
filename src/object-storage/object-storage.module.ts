import { Module } from "@nestjs/common";
import { TelegramModule } from "../telegram/telegram.module";
import { ObjectStorageService } from "./object-storage/object-storage.service";

@Module({
  imports: [TelegramModule],
  providers: [ObjectStorageService],
  exports: [ObjectStorageService],
})
export class ObjectStorageModule {}
