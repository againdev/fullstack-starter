import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "./jwt-payload";

@Injectable()
export class GraphqlAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gql = GqlExecutionContext.create(context);
    const req = gql.getContext<{ req?: Request }>().req;
    const token = req?.cookies?.access_token as string | undefined;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.config.getOrThrow<string>("ACCESS_TOKEN_SECRET"),
      });
      if (req) {
        req.user = payload;
      }
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
