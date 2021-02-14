import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GitlabToken } from '../entities/gitlab-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GitlabTokenService {
  constructor(
    @InjectRepository(GitlabToken)
    private gitlabTokenRepository: Repository<GitlabToken>,
  ) {}

  findOne(id: string) {
    return this.gitlabTokenRepository.findOne({ where: { id } });
  }

  findOneByUserId(userId: string) {
    return this.gitlabTokenRepository.findOne({ where: { userId } });
  }

  create(userId: string, token: string) {
    const gitlabToken = this.gitlabTokenRepository.create({
      token: token,
      userId: userId,
    });
    return this.gitlabTokenRepository.save(gitlabToken);
  }

  async update(userId: string, token: string) {
    const gitlabToken = await this.findOneByUserId(userId);
    gitlabToken.token = token;
    gitlabToken.expired = false;
    return this.gitlabTokenRepository.save(gitlabToken);
  }
}
