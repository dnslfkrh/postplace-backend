import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JWT_REFRESH_SECRET, JWT_SECRET } from 'src/configs/env.config';
import { UserException, UserExceptionCode } from 'src/exception/user.exception';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async generateTokens(user: User) {
        const payload = {
            // 여기에 넣을 키 추가하기
            userEmail: user.email,
            userID: user.id,
        };

        const accessToken = await this.jwtService.sign(payload, {
            secret: JWT_SECRET,
            expiresIn: '60m',
        });

        const refreshToken = await this.jwtService.sign(payload, {
            secret: JWT_REFRESH_SECRET,
            expiresIn: '14d',
        });

        return {
            accessToken,
            refreshToken,
        };
    };

    async validateUserToJudgmentLoginOrRegister(details: Partial<User>): Promise<User> {
        const { id, email } = details;

        if (!details.id && !details.email) {
            throw new UserException(UserExceptionCode.USER_BAD_REQUEST);
        }

        let user = await this.userRepository.findByIDAndEmail(id, email);

        if (user) {
            return user; // 이미 저장된 회원이면 저장 X
        }

        user = await this.userRepository.createUser(details);

        return user;
    };
}