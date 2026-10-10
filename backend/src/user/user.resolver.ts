import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { GraphqlAuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { JwtPayload } from "../auth/jwt-payload";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { Role } from "../generated/prisma/client";
import { UserModel } from "./user.model";
import { UserService } from "./user.service";

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly users: UserService) {}

  @Query(() => UserModel, { nullable: true })
  @UseGuards(GraphqlAuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return this.users.findById(user.sub);
  }

  @Query(() => [UserModel])
  @UseGuards(GraphqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  usersList() {
    return this.users.findAll();
  }
}
