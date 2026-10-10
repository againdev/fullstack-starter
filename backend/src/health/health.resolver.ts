import { Query, Resolver, Subscription } from "@nestjs/graphql";
import { interval, map } from "rxjs";
import { HealthStatus } from "./health.model";
import { HealthService } from "./health.service";

@Resolver()
export class HealthResolver {
  constructor(private readonly health: HealthService) {}

  @Query(() => HealthStatus)
  healthStatus() {
    return this.health.check();
  }

  @Subscription(() => String)
  serverTime() {
    return interval(5000).pipe(map(() => new Date().toISOString()));
  }
}
