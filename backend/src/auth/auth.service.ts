import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { CookieOptions, Request, Response } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "../generated/prisma/client";
import { LoginInput, RegisterInput } from "./auth.inputs";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(input: RegisterInput, res: Response) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("Email is already registered");
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        name: input.name.trim(),
        passwordHash: await bcrypt.hash(input.password, 12),
      },
    });

    await this.setAuthCookies(res, user);
    return user;
  }

  async login(input: LoginInput, res: Response) {
    const email = input.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    const matches =
      user && (await bcrypt.compare(input.password, user.passwordHash));

    if (!user || !matches) {
      throw new UnauthorizedException("Invalid email or password");
    }

    await this.setAuthCookies(res, user);
    return user;
  }

  async refresh(req: Request, res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(token, {
        secret: this.config.getOrThrow<string>("REFRESH_TOKEN_SECRET"),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      await this.setAuthCookies(res, user);
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }

  logout(res: Response) {
    const options = this.cookieOptions();
    res.clearCookie(ACCESS_COOKIE, options);
    res.clearCookie(REFRESH_COOKIE, options);
    return true;
  }

  private async setAuthCookies(res: Response, user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessTtl = this.config.getOrThrow<number>("ACCESS_TOKEN_TTL_SECONDS");
    const refreshTtl = this.config.getOrThrow<number>(
      "REFRESH_TOKEN_TTL_SECONDS",
    );

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>("ACCESS_TOKEN_SECRET"),
      expiresIn: accessTtl,
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>("REFRESH_TOKEN_SECRET"),
      expiresIn: refreshTtl,
    });

    res.cookie(ACCESS_COOKIE, accessToken, {
      ...this.cookieOptions(),
      maxAge: accessTtl * 1000,
    });
    res.cookie(REFRESH_COOKIE, refreshToken, {
      ...this.cookieOptions(),
      maxAge: refreshTtl * 1000,
    });
  }

  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get<string>("NODE_ENV") === "production",
      sameSite: "lax",
      path: "/",
    };
  }
}
