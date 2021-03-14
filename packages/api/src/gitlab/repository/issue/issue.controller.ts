import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { IssueService } from './issue.service';
import { RepositoryService } from '../repository.service';
import { IdParam } from '../../../common/id-param';

@Controller('issue')
export class IssueController {
  constructor(
    private readonly IssueService: IssueService,
    private readonly repositoryService: RepositoryService,
  ) {}

  @Get('/repository/:id')
  async findAllForRepository(@Param() { id }: IdParam) {
    const repository = await this.repositoryService.findOne(id);
    if (repository) {
      return this.IssueService.findAllForRepository(repository);
    }
    throw new NotFoundException(
      `Could not find any issues for repository with id: ${id}`,
    );
  }
  @Get(':id')
  async findOne(@Param() { id }: IdParam) {
    const issue = await this.IssueService.findOne(id);
    if (issue) {
      return issue;
    }
    throw new NotFoundException(`Could not find issue with id: ${id}`);
  }
}
