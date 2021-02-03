import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GitlabToken } from '../entities/gitlab_token.entity';
import { Repository, getConnection } from 'typeorm';

@Injectable()
export class GitlabTokenService {
  constructor(
    @InjectRepository(GitlabToken)
    private gitlabTokenRepository: Repository<GitlabToken>,
  ) {}

  findOne(id: string) {
    return this.gitlabTokenRepository.findOne({ where: { id } });
  }

  create(userId: string, token: string) {
    const gitlabToken = this.gitlabTokenRepository.create({
      token: token,
      userId: userId,
    });
    return this.gitlabTokenRepository.save(gitlabToken);
  }

  async update(userId: string, token: string) {
    await getConnection()
      .createQueryBuilder()
      .update(GitlabToken)
      .set({ token: token })
      .where('user_id = :user_id', { user_id: userId })
      .execute();
  }
}
