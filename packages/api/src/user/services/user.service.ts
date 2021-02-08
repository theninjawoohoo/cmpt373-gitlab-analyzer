import { Profile } from '@ceres/types';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
  ) {}

  async createSfuUser(sfuId: string) {
    const user = this.userRepository.create({
      auth: { type: 'sfu', userId: sfuId },
    });
    return this.userRepository.save(user);
  }

  async findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
    });
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

  async updateWithGitlab(user: User, token: string) {
    const axiosResponse = await this.httpService
      .get<Profile>('/user', {
        headers: {
          'PRIVATE-TOKEN': token,
        },
      })
      .toPromise();
    user.profile = axiosResponse.data;
    return this.userRepository.save(user);
  }
}
