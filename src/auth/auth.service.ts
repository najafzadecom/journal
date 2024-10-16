import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ username, password: hashedPassword });
        return this.userRepository.save(user);
    }

    async validateUser(username: string, password: string): Promise<string> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = { username: user.username, sub: user.id };
            return this.jwtService.sign(payload);
        }
        return null;
    }
}