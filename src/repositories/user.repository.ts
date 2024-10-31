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

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }

    async createUser(details: Partial<User>): Promise<User> {
        const user = this.userRepository.create(details);
        return this.userRepository.save(user);
    }
}