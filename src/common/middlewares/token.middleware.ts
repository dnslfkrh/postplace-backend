import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from 'src/modules/auth/auth.service';
import { JWT_SECRET } from 'src/configs/env.config';
import { Exception, ExceptionCode } from 'src/common/exceptions/Exceptions';
import { resCookie } from '../utils/resCookie';
import { UserService } from 'src/modules/user/user.service';
import { TokenPayload } from '../types/Props';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const tokens = this.extractTokens(req);
            const decodedToken = await this.processTokens(tokens, res);

            req['user'] = decodedToken.userID;
            next();
        } catch (error) {
            this.handleTokenError(error);
        }
    }

    private extractTokens(req: Request): { accessToken?: string; refreshToken?: string } {
        const { accessToken, refreshToken } = req.cookies;

        if (!refreshToken) {
            throw new Exception(ExceptionCode.USER_UNAUTHORIZED);
        }

        return { accessToken, refreshToken };
    }

    private async processTokens(
        { accessToken, refreshToken }: { accessToken?: string; refreshToken?: string }, res: Response
    ): Promise<TokenPayload> {
        let decodedToken: TokenPayload;

        if (!accessToken) {
            // access token 없으면 재발급
            decodedToken = await this.regenerateTokens(refreshToken, res);
        } else {
            try {
                // 기존 access token 검증
                decodedToken = this.verifyAccessToken(accessToken);
                // 만료되지 않았으면 통과~
            } catch (error) {
                // 만료된 경우 재발급
                if (error instanceof jwt.TokenExpiredError) {
                    decodedToken = await this.regenerateTokens(refreshToken, res);
                } else {
                    throw new Exception(ExceptionCode.VALIDATION_FAILED);
                }
            }
        }

        await this.validateUser(decodedToken);

        return decodedToken;
    }

    private verifyAccessToken(accessToken: string): TokenPayload {
        return jwt.verify(accessToken, JWT_SECRET) as TokenPayload;
    }

    private async regenerateTokens(refreshToken: string, res: Response): Promise<TokenPayload> {
        const decodedRefreshToken = await this.authService.verifyRefreshToken(refreshToken);

        if (!decodedRefreshToken) {
            throw new Exception(ExceptionCode.USER_UNAUTHORIZED);
        }

        const user = await this.validateUserById(decodedRefreshToken.userID, decodedRefreshToken.userEmail);

        const newAccessToken = await this.authService.regenerateAccessToken(user);

        await resCookie(res, "accessToken", newAccessToken);

        return jwt.verify(newAccessToken, JWT_SECRET) as TokenPayload;
    }

    private async validateUser(decodedToken: TokenPayload): Promise<void> {
        if (!decodedToken || !decodedToken.userID) {
            throw new Exception(ExceptionCode.USER_UNAUTHORIZED);
        }

        await this.validateUserById(decodedToken.userID, decodedToken.userEmail);
    }

    private async validateUserById(userID: number, userEmail: string): Promise<any> {
        const user = await this.userService.findUserWithIdAndEmail(userID, userEmail);

        return user;
    }

    private handleTokenError(error: any): never {
        console.error('토큰 미들웨어 오류:', error);

        if (error instanceof Exception) {
            throw error;
        }

        throw new Exception(ExceptionCode.INTERNAL_SERVER_ERROR);
    }
}
