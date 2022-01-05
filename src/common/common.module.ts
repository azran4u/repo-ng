import { Module } from "@nestjs/common";
import { LoggingPlugin } from "./plugins/logging.plugin";

@Module({
  providers: [LoggingPlugin],
})
export class CommonModule {}
