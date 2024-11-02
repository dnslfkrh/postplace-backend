import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    // 등록된 회원인지 검사
    async findByIDAndEmail(id: number, email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id, email } });
    }

    // 사용자 등록
    async createUser(details: Partial<User>): Promise<User> {
        const user = this.userRepository.create(details);
        return this.userRepository.save(user);
    }
}