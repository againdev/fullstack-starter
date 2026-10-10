import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { GraphqlAuthGuard } from "./auth.guard";
import { RolesGuard } from "./roles.guard";

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthResolver, AuthService, GraphqlAuthGuard, RolesGuard],
  exports: [GraphqlAuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
