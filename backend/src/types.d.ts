import { JwtPayload } from "./auth/jwt-payload";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
