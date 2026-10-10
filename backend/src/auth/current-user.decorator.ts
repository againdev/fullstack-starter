import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtPayload } from "./jwt-payload";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtPayload => {
    const gql = GqlExecutionContext.create(context);
    return gql.getContext<{ req: { user: JwtPayload } }>().req.user;
  },
);
