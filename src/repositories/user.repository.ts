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

    async findByIDAndEmail(id: number, email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { id, email } });
    };

    // 사용자 등록
    async createUser(details: Partial<User>): Promise<User> {
        const user = this.userRepository.create(details);
        return await this.userRepository.save(user);
    };
}