import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createSfuUser(sfuId: string) {
    const user = this.userRepository.create({
      auth: { type: 'sfu', userId: sfuId },
    });
    return this.userRepository.save(user);
  }

  async findBySfuId(sfuId: string) {
    return this.userRepository.findOne({
      where: {
        auth: { type: 'sfu', userId: sfuId },
      },
    });
  }

  async getProfileById(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return {
      id: user.id,
      type: user.auth.type,
      sfuId: user.auth.userId,
    };
  }
}
