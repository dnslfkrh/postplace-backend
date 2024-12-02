import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JWT_REFRESH_SECRET, JWT_SECRET } from 'src/configs/env.config';
import { Exception, ExceptionCode } from 'src/common/exceptions/Exceptions';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async generateTokens(user: User) {
        try {
            if (!user) {
                throw new Exception(ExceptionCode.USER_NOT_FOUND);
            }

            const payload = {
                userEmail: user.email,
                userID: user.id,
            };

            const accessToken = await this.jwtService.sign(payload, {
                secret: JWT_SECRET,
                expiresIn: '120m',
            });

            const refreshToken = await this.jwtService.sign(payload, {
                secret: JWT_REFRESH_SECRET,
                expiresIn: '14d',
            });

            return {
                accessToken,
                refreshToken,
            };

        } catch (error) {
            console.error('서버 오류:', error);
            throw new Exception(ExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }

    async verifyRefreshToken(refreshToken: string) {
        try {
            if (!refreshToken) {
                throw new Exception(ExceptionCode.USER_UNAUTHORIZED);
            }

            return await this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET')
            }) as { userID: number; userEmail: string; };

        } catch (error) {
            console.error('서버 오류:', error);
            throw new Exception(ExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }

    async regenerateAccessToken(user: User) {
        try {
            if (!user) {
                throw new Exception(ExceptionCode.USER_NOT_FOUND);
            }

            const payload = {
                userEmail: user.email,
                userID: user.id,
            };

            const newAccessToken = await this.jwtService.sign(payload, {
                secret: JWT_SECRET,
                expiresIn: '120m',
            });

            return newAccessToken;

        } catch (error) {
            console.error('서버 오류:', error);
            throw new Exception(ExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }
}
