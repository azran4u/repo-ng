import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { envToBooleanWIthDefault } from "../../utils/string.to.boolean.with.default";

export const AllowPartialDelete = createParamDecorator<any, any, boolean>(
  (data: unknown, ctx: ExecutionContext) => {
    const req = GqlExecutionContext.create(ctx).getContext().req;
    const allow_partial_delete = envToBooleanWIthDefault(
      req?.headers?.allow_partial_delete,
      false
    );
    return allow_partial_delete;
  }
);
