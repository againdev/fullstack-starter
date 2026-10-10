import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { HealthStatus } from "./health.model";

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async check(): Promise<HealthStatus> {
    let database = "ok";
    let redis = "ok";

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = "error";
    }

    try {
      const reply = await this.redis.ping();
      if (reply !== "PONG") {
        redis = "error";
      }
    } catch {
      redis = "error";
    }

    return {
      status: database === "ok" && redis === "ok" ? "ok" : "error",
      database,
      redis,
    };
  }
}
