import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GitlabToken } from '../entities/gitlab-token.entity';
import { Repository } from 'typeorm';
import { AxiosResponse } from 'axios';

@Injectable()
export class GitlabTokenService {
  constructor(
    @InjectRepository(GitlabToken)
    private gitlabTokenRepository: Repository<GitlabToken>,
    private httpService: HttpService,
  ) {}

  findOne(id: string) {
    return this.gitlabTokenRepository.findOne({ where: { id } });
  }

  findOneByUserId(userId: string) {
    return this.gitlabTokenRepository.findOne({ where: { userId } });
  }

  async validate({ token }: GitlabToken) {
    let axiosResponse: AxiosResponse;
    let attemptsCount = 0;
    while (!axiosResponse && attemptsCount < 5) {
      try {
        axiosResponse = await this.httpService
          .get('/projects', {
            headers: {
              'PRIVATE-TOKEN': token,
            },
            params: {
              per_page: 1,
            },
          })
          .toPromise();
        return axiosResponse.status === 200;
      } catch (e) {}
      attemptsCount++;
    }

    return false;
  }

  markInvalid(token: GitlabToken) {
    token.expired = true;
    return this.gitlabTokenRepository.save(token);
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
