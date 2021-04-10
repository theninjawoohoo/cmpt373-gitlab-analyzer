import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { IssueService } from './issue.service';
import { RepositoryService } from '../repository.service';
import { IdParam } from '../../../common/id-param';
import { NoteService } from '../note/note.service';
import { paginatedToResponse } from '../../../common/pagination';
import { IssueQueryDto } from './issue-query.dto';

@Controller('issue')
export class IssueController {
  constructor(
    private readonly issueService: IssueService,
    private readonly repositoryService: RepositoryService,
    private readonly noteService: NoteService,
  ) {}

  @Get('/repository/:id')
  async findAllForRepository(@Param() { id }: IdParam) {
    const repository = await this.repositoryService.findOne(id);
    if (repository) {
      return this.issueService.findAllForRepository(repository);
    }
    throw new NotFoundException(
      `Could not find any issues for repository with id: ${id}`,
    );
  }
  @Get(':id')
  async findOne(@Param() { id }: IdParam) {
    const issue = await this.issueService.findOne(id);
    if (issue) {
      return issue;
    }
    throw new NotFoundException(`Could not find issue with id: ${id}`);
  }

  @Get(':id/note')
  async getAllIssueNotes(@Param() { id }: IdParam) {
    const issue = await this.issueService.findOne(id);
    if (issue) {
      return await this.noteService.findAllForIssue(issue);
    }
    throw new NotFoundException(`no notes found for issue id: ${id}`);
  }

  @Get()
  search(@Query() query: IssueQueryDto) {
    return paginatedToResponse(this.issueService.search(query));
  }
}
