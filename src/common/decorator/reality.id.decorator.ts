import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

export const RealityId = createParamDecorator<any, any, string>(
  (data: unknown, ctx: ExecutionContext) => {
    const req = GqlExecutionContext.create(ctx).getContext().req;
    const realityId = String(req?.headers?.reality_id);
    if (!realityId) throw new GraphQLError("reality id header is missing");
    return realityId;
  }
);
