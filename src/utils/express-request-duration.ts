import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { getDurationInMilliseconds } from "./getDurationInMilliseconds";
@Injectable()
export class RequestDurationMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();
    const logger = this.logger;
    function logDuration() {
      const durationInMilliseconds = getDurationInMilliseconds(start);
      const operation =
        req?.graphql?.subOperation || `${req.url} ${req.method}`;
      logger.info(
        `request for ${operation} took ${durationInMilliseconds}[ms]`
      );
    }
    res.on("finish", () => {
      logDuration();
    });

    res.on("close", () => {
      logDuration();
    });
    next();
  }
}
