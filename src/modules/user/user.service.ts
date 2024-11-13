import { Injectable } from '@nestjs/common';
import { Exception, ExceptionCode } from 'src/common/exceptions/Exceptions';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async getUser(id: number) {
        try {
            const user = await this.userRepository.findById(id);

            if (!user) {
                throw new Exception(ExceptionCode.USER_NOT_FOUND);
            }

            return user;
        } catch (error) {
            console.error('서버 오류:', error);
            throw new Exception(ExceptionCode.INTERNAL_SERVER_ERROR);
        }
    };
}
