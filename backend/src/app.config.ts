import {
  IsBoolean,
  IsInt,
  IsString,
  Min,
  validateSync,
} from "class-validator";
import { plainToInstance, Transform } from "class-transformer";

function asBoolean(value: unknown): boolean {
  return value === true || value === "true";
}

export class AppConfig {
  @IsString()
  NODE_ENV: string;

  @IsString()
  APP_ADDRESS: string;

  @IsInt()
  @Min(1)
  APP_PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  REDIS_HOST: string;

  @IsInt()
  @Min(1)
  REDIS_PORT: number;

  @IsString()
  REDIS_PASSWORD: string;

  @IsString()
  CORS_ORIGIN: string;

  @Transform(({ value }) => asBoolean(value))
  @IsBoolean()
  GRAPHQL_ENABLE_IDE: boolean;

  @Transform(({ value }) => asBoolean(value))
  @IsBoolean()
  GRAPHQL_ENABLE_INTROSPECTION: boolean;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsInt()
  @Min(60)
  ACCESS_TOKEN_TTL_SECONDS: number;

  @IsInt()
  @Min(60)
  REFRESH_TOKEN_TTL_SECONDS: number;
}

export function validateAppConfig(config: Record<string, unknown>) {
  const validated = plainToInstance(AppConfig, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validated;
}
