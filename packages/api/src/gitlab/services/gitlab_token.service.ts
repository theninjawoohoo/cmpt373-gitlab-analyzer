import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GitlabToken } from '../entities/gitlab_token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(GitlabToken)
    private gitlabTokenRepository: Repository<GitlabToken>,
  ) {}

  findOne(id: string): string {
    return this.gitlabTokenRepository.findOne(id);
  }

  create(token: GitlabToken) {
    this.gitlabTokenRepository.insert(token);
  }
}
