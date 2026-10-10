import { Field, GraphQLISODateTime, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Role } from "../generated/prisma/client";

registerEnumType(Role, { name: "Role" });

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => Role)
  role: Role;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;
}
