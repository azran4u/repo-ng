import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { NEST_LOADER_CONTEXT_KEY } from "./dataloader.context.key";
import { DataLoaderInterceptor } from "./dataloader.interceptor";

export const Loader = createParamDecorator(
  async (data: any, context: ExecutionContext & { [key: string]: any }) => {
    const ctx: any = GqlExecutionContext.create(context).getContext();
    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
      throw new InternalServerErrorException(`
              You should provide interceptor ${DataLoaderInterceptor.name} globally with ${APP_INTERCEPTOR}
            `);
    }
    return await ctx[NEST_LOADER_CONTEXT_KEY].getLoader(data);
  }
);
