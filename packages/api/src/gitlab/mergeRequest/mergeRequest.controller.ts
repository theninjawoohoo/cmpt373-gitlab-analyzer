import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { MergeRequestService } from './mergeRequest.service';
import { GitlabToken } from '../../auth/decorators/gitlab-token.decorator';
import { RepositoryService } from '../repository/repository.service';

@Controller('mergerequest')
export class MergeRequestController {
  constructor(
    private readonly mergeRequestService: MergeRequestService,
    private readonly repositoryService: RepositoryService,
  ) {}

  @Get('/repository/:repository_id')
  async findAllForRepository(
    @Param('repository_id') repoId: string
  ){
    const repository = await this.repositoryService.findOne(repoId);
    return this.mergeRequestService.findAllForRepository(repository);
  }

  @Get(':id')
  findOne(@Param('id') mergeRequestId: string) {
    return this.mergeRequestService.findOne(mergeRequestId);
  }

  @Post('/repository/:repository_id')
  @HttpCode(204)
  async fetchMergeRequests(
    @Param('repository_id') repoId: string,
    @GitlabToken() token: string,
  ) {
    const repository = await this.repositoryService.findOne(repoId);
    await this.mergeRequestService.fetchForRepository(repository, token);
  }
}
