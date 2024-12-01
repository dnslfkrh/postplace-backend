import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from 'src/modules/auth/auth.service';
import { JWT_SECRET } from 'src/configs/env.config';
import { Exception, ExceptionCode } from 'src/common/exceptions/Exceptions';
import { UserRepository } from 'src/repositories/user.repository';
import { resCookie } from '../utils/resCookie';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        // refresh 토큰은 없으면 안됨
        if (!refreshToken) {
            throw new Exception(ExceptionCode.USER_UNAUTHORIZED);
        }

        let decodedToken;

        const setNewAccessToken = async () => {
            const decodedRefreshToken = await this.authService.verifyRefreshToken(refreshToken);

            if (!decodedRefreshToken) {
                throw new Exception(ExceptionCode.USER_UNAUTHORIZED);
            }

            const user = await this.userRepository.findById(decodedRefreshToken.userID);

            if (!user) {
                throw new Exception(ExceptionCode.USER_NOT_FOUND);
            }

            const newAccessToken = await this.authService.regenerateAccessToken(user);
            resCookie(res, 'accessToken', newAccessToken);

            decodedToken = jwt.verify(newAccessToken, JWT_SECRET) as { userID: number; userEmail: string };
        };

        try {
            if (!accessToken) {             // access token 없으면
                await setNewAccessToken();  // 재발급
            } else {
                try {
                    decodedToken = jwt.verify(accessToken, JWT_SECRET) as { userID: number; userEmail: string };    // 있으면 토큰 검증
                } catch (error) {                                                                                   // 만료되었으면,
                    if (error instanceof jwt.TokenExpiredError) {
                        await setNewAccessToken();                                                                  // 재발급
                    } else {
                        throw new Exception(ExceptionCode.VALIDATION_FAILED);
                    }
                }
            }

            if (!decodedToken || !decodedToken.userID) {
                throw new Exception(ExceptionCode.USER_UNAUTHORIZED);
            }

            const user = await this.userRepository.findByIDAndEmail(decodedToken.userID, decodedToken.userEmail);   // 사용자 최종 검증

            if (!user) {
                throw new Exception(ExceptionCode.USER_NOT_FOUND);                                                  // 검증되지 않은 사용자 또는 없는 사용자
            }

            req['user'] = user.id;                                                                                  // 사용자 정보 기억

            next();
        } catch (error) {
            console.error('토큰 미들웨어 오류:', error);
            throw new Exception(ExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }
}
