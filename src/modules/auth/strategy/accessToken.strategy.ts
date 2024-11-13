import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request.cookies["accessToken"];
            }]),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_SECRET")
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            userName: payload.username
        };
    }
}