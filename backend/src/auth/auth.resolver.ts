import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Request, Response } from "express";
import { UserModel } from "../user/user.model";
import { LoginInput, RegisterInput } from "./auth.inputs";
import { AuthService } from "./auth.service";

type GraphqlContext = {
  req: Request;
  res: Response;
};

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => UserModel)
  register(
    @Args("input") input: RegisterInput,
    @Context() context: GraphqlContext,
  ) {
    return this.auth.register(input, context.res);
  }

  @Mutation(() => UserModel)
  login(
    @Args("input") input: LoginInput,
    @Context() context: GraphqlContext,
  ) {
    return this.auth.login(input, context.res);
  }

  @Mutation(() => Boolean)
  refreshToken(@Context() context: GraphqlContext) {
    return this.auth.refresh(context.req, context.res);
  }

  @Mutation(() => Boolean)
  logout(@Context() context: GraphqlContext) {
    return this.auth.logout(context.res);
  }
}
