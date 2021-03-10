import { BadRequestException, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { paginatedToResponse } from '../../../common/pagination';
import { CommitQueryDto } from './commit-query.dto';
import { IdParam } from '../../../common/id-param';
import { CommitService } from './commit.service';
import { CommitDailyCounQueryDto } from './daily-count/daily-count-query.dto';
import { CommitDailyCountService } from './daily-count/daily-count.service';
import { RepositoryService } from '../repository.service';

@Controller('commit')
export class CommitController {
  constructor(
    private readonly commitService: CommitService,
    private readonly repositoryService: RepositoryService,
    private readonly commitDailyCountService: CommitDailyCountService,
  ) {}

  @Get()
  search(@Query() query: CommitQueryDto) {
    const { merge_request, repository } = query;
    if (!merge_request && !repository) {
      throw new BadRequestException(
        'repository or merge_request must be provided',
      );
    }
    return paginatedToResponse(this.commitService.search(query));
  }

  @Get('daily_count')
  dailyCountSearch(@Query() query: CommitDailyCounQueryDto) {
    return paginatedToResponse(this.commitDailyCountService.search(query));
  }

  @Post('score/repository/:id')
  async syncCommitScoreByRepository(@Param() { id }: IdParam) {
    const repository = await this.repositoryService.findOne(id);
    return this.commitService.fetchAllScore(repository);
  }
}
