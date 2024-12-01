import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from 'src/configs/env.config';
import { Exception, ExceptionCode } from 'src/common/exceptions/Exceptions';
import { resCookie } from '../utils/resCookie';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthService } from 'src/modules/auth/auth.service';

// 토큰 관련 인터페이스 정의
interface TokenPayload {
    userID: number;
    userEmail: string;
}

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const tokens = this.extractTokens(req);
            const decodedToken = await this.processTokens(tokens, res);

            // 사용자 정보 기억
            req['user'] = decodedToken.userID;

            next();
        } catch (error) {
            this.handleTokenError(error);
        }
    }

    // 토큰 추출 메서드
    private extractTokens(req: Request): { accessToken?: string; refreshToken?: string } {
        const { accessToken, refreshToken } = req.cookies;

        if (!refreshToken) {
            throw new Exception(ExceptionCode.USER_UNAUTHORIZED);
        }

        return { accessToken, refreshToken };
    }

    // 토큰 재발급 처리 관련
    private async processTokens(
        { accessToken, refreshToken }: { accessToken?: string; refreshToken?: string },
        res: Response
    ): Promise<TokenPayload> {
        let decodedToken: TokenPayload;

        if (!accessToken) {
            // access token 없으면 재발급
            decodedToken = await this.regenerateTokens(refreshToken, res);
        } else {
            try {
                // access token 있으면
                // 기존 access token 검증
                decodedToken = this.verifyAccessToken(accessToken);
            } catch (error) {
                // 만료된 경우 재발급
                if (error instanceof jwt.TokenExpiredError) {
                    decodedToken = await this.regenerateTokens(refreshToken, res);
                } else {
                    throw new Exception(ExceptionCode.VALIDATION_FAILED);
                }
            }
        }

        // 최종 사용자 검증
        await this.userRepository.findByIDAndEmail(decodedToken.userID, decodedToken.userEmail); 

        return decodedToken;
    }

    // Access Token 검증 메서드
    private verifyAccessToken(accessToken: string): TokenPayload {
        return jwt.verify(accessToken, JWT_SECRET) as TokenPayload;
    }

    // 토큰 재발급 메서드
    private async regenerateTokens(refreshToken: string, res: Response): Promise<TokenPayload> {
        // Refresh Token 검증
        const decodedRefreshToken = await this.authService.verifyRefreshToken(refreshToken);

        if (!decodedRefreshToken) {
            throw new Exception(ExceptionCode.USER_UNAUTHORIZED);
        }

        const user = await this.userRepository.findById(decodedRefreshToken.userID);

        // 새 Access Token 생성
        const newAccessToken = await this.authService.regenerateAccessToken(user);

        // 쿠키에 새 토큰 설정
        resCookie(res, 'accessToken', newAccessToken);

        return jwt.verify(newAccessToken, JWT_SECRET) as TokenPayload;
    }

    // 토큰 오류 처리 메서드
    private handleTokenError(error: any): never {
        console.error('토큰 미들웨어 오류:', error);

        if (error instanceof Exception) {
            throw error;
        }

        throw new Exception(ExceptionCode.INTERNAL_SERVER_ERROR);
    }
}