import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/User.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findUserNameById(id: number): Promise<User | undefined> {
        return await this.userRepository.findOne({
            where: { id },
            select: ['name']
        });
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async findByIDAndEmail(id: number, email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { id, email } });
    }

    async createUser(details: Partial<User>): Promise<User> {
        const user = this.userRepository.create(details);
        return await this.userRepository.save(user);
    }
}