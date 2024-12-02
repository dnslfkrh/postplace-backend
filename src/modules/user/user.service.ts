import { Injectable } from '@nestjs/common';
import { Exception, ExceptionCode } from 'src/common/exceptions/Exceptions';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async validateUserToJudgmentLoginOrRegister(details: Partial<User>): Promise<User> {
        try {
            const { id, email } = details;

            if (!details.id && !details.email) {
                throw new Exception(ExceptionCode.BAD_REQUEST);
            }

            let user = await this.findUserWithIdAndEmail(id, email);

            if (user) {
                return user; // 이미 저장된 회원이면 저장 X
            }

            user = await this.userRepository.createUser(details);

            return user;
        } catch (error) {
            console.error('서버 오류:', error);
            throw new Exception(ExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }

    async findUserWithIdAndEmail(id: number, email: string): Promise<User | undefined> {
        const user = await this.userRepository.findByIDAndEmail(id, email);

        if (!user) {
            throw new Exception(ExceptionCode.USER_NOT_FOUND);
        }

        return user;
    }
}
