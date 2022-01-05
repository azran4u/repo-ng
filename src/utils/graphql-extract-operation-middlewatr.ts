import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class GraphqlExtractOperationMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const operationName = req.body?.operationName;
    const query: string = req.body?.query || req.query?.query;
    if (!query) return next();
    const isMutation = query.indexOf(`mutation ${operationName}`) !== -1;
    const isQuery = query.indexOf(`query ${operationName}`) !== -1;
    const isSubscription =
      query.indexOf(`subscription ${operationName}`) !== -1;
    let operationType: "query" | "mutation" | "subscription";
    if (isQuery) operationType = "query";
    if (isMutation) operationType = "mutation";
    if (isSubscription) operationType = "subscription";
    const subOperation = query
      .split(`${operationType} ${operationName}`)[1]
      .trim()
      .split("{")[1]
      .split("(")[0]
      .trim();

    if (operationName && operationType && subOperation) {
      req.graphql = { operationName, operationType, subOperation };
      this.logger.info(`${JSON.stringify(req.graphql)}`);
    }
    next();
  }
}
