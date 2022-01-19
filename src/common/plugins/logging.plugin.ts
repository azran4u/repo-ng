import { Inject } from "@nestjs/common";
import { Plugin } from "@nestjs/graphql";
import { GraphQLRequestContext } from "apollo-server-core";
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from "apollo-server-plugin-base";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  async requestDidStart(
    requestContext: GraphQLRequestContext
  ): Promise<GraphQLRequestListener> {
    const logger = this.logger;
    return {
      async willSendResponse() {},
    };
  }
}
