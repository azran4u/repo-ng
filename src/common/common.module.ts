import { Module } from "@nestjs/common";
import { GqlExceptionStackTraceFilter } from "./exception.filter";
import { LoggingPlugin } from "./plugins/logging.plugin";

@Module({
  providers: [LoggingPlugin, GqlExceptionStackTraceFilter],
  exports: [GqlExceptionStackTraceFilter],
})
export class CommonModule {}
