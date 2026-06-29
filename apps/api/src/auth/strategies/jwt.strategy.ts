import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: any) => {
          return request?.query?.token;
        },
      ]),

      ignoreExpiration: false,

      secretOrKey: "SUPER_SECRET_KEY",
    });
  }

  async validate(payload: any) {
    return {
      _id: payload.sub,
    };
  }
}
