import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { AppConfig, validateAppConfig } from "./app.config";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateAppConfig,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => ({
        autoSchemaFile: true,
        sortSchema: true,
        graphiql: config.get("GRAPHQL_ENABLE_IDE", { infer: true }),
        introspection: config.get("GRAPHQL_ENABLE_INTROSPECTION", {
          infer: true,
        }),
        context: ({ req, res }: { req: unknown; res: unknown }) => ({
          req,
          res,
        }),
        subscriptions: {
          "graphql-ws": true,
        },
      }),
    }),
    PrismaModule,
    RedisModule,
    HealthModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
