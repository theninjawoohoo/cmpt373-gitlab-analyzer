import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { paginatedToResponse } from '../../../common/pagination';
import { CommitQueryDto } from './commit-query.dto';
import { CommitService } from './commit.service';
import { CommitDailyCounQueryDto } from './daily-count/daily-count-query.dto';
import { CommitDailyCountService } from './daily-count/daily-count.service';

@Controller('commit')
export class CommitController {
  constructor(
    private readonly commitService: CommitService,
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
}
