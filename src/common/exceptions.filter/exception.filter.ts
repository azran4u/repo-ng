import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch(GraphQLError)
export class GqlExceptionStackTraceFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // const gqlHost = GqlArgumentsHost.create(host);
    exception.stack = "";
    return exception;
  }
}
