import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JWT_REFRESH_SECRET, JWT_SECRET } from 'src/_configs/env.config';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async generateTokens(user: User) {
        const payload = {
            // 여기에 넣을 키 추가하기
            username: user.email,
            sub: user.id,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: JWT_SECRET,
            expiresIn: '60m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: JWT_REFRESH_SECRET,
            expiresIn: '14d',
        });

        return {
            accessToken,
            refreshToken,
        };
    };

    async validateUser(details: Partial<User>): Promise<User> {
        const { email } = details;

        let user = await this.userRepository.findByEmail(email);

        if (user) {
            return user;
        }

        if (!details.email || !details.firstName || !details.lastName) {
            throw new Error('필수 사용자 정보가 누락되었습니다.');
        }

        user = await this.userRepository.createUser(details);
        return user;
    };
}