import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Param,
  Query,
} from '@nestjs/common';
import { paginatedToResponse } from '../../../common/pagination';
import { CommitQueryDto } from './commit-query.dto';
import { IdParam } from '../../../common/id-param';
import { CommitService } from './commit.service';

@Controller('commit')
export class CommitController {
  constructor(private readonly commitService: CommitService) {}

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

  @Get('count')
  dailyCounts(@Query() query: CommitQueryDto) {
    return this.commitService.buildDailyCounts(query);
  }

  @Post('score/repository/:id')
  async syncCommitScoreByRepository(@Param() { id }: IdParam) {
    return this.commitService.updateCommitScoreByRepository(id);
  }
}
