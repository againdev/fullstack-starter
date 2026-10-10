import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class HealthStatus {
  @Field()
  status: string;

  @Field()
  database: string;

  @Field()
  redis: string;
}
