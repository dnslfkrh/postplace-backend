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
    
            if (decodedToken) {
                req['user'] = decodedToken.userID;
            }
            
            next();
        } catch (error) {
            this.handleTokenError(error);
        }
    }

    private extractTokens(req: Request): { accessToken?: string; refreshToken?: string } {
        const { accessToken, refreshToken } = req.cookies;

        return { accessToken, refreshToken };
    }

    private async processTokens(
        { accessToken, refreshToken }: { accessToken?: string; refreshToken?: string }, res: Response
    ): Promise<TokenPayload | null> {
        if (!accessToken && !refreshToken) {
            return null;
        }
    
        let decodedToken: TokenPayload;
    
        if (!accessToken) {
            if (!refreshToken) {
                return null;
            }
            
            try {
                decodedToken = await this.regenerateTokens(refreshToken, res);
            } catch {
                return null;
            }
        } else {
            try {
                decodedToken = this.verifyAccessToken(accessToken);
            } catch (error) {
                if (error instanceof jwt.TokenExpiredError) {
                    if (!refreshToken) {
                        return null;
                    }
                    
                    try {
                        decodedToken = await this.regenerateTokens(refreshToken, res);
                    } catch {
                        return null;
                    }
                } else {
                    throw new Exception(ExceptionCode.VALIDATION_FAILED);
                }
            }
        }
    
        try {
            await this.validateUser(decodedToken);
        } catch {
            return null;
        }
    
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
