import { ScoringConfig } from '@ceres/types';
import { Body } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';
import { IdParam } from '../../common/id-param';
import { Auth } from '../../auth/decorators/auth.decorator';
import { VerifiedUser } from '../../auth/types/VerifiedUser';
import { ScoringConfigService } from './scoring-config.service';
import { paginatedToResponse } from '../../common/pagination';

@Controller('scoring_config')
export class ScoringConfigController {
  constructor(private readonly scoringConfigService: ScoringConfigService) {}

  @Get()
  search(@Auth() { user }: VerifiedUser) {
    return paginatedToResponse(this.scoringConfigService.search({ user }));
  }

  @Get(':id')
  findOne(@Param() { id }: IdParam) {
    return this.scoringConfigService.findOne(id);
  }

  @Post()
  create(@Auth() { user }: VerifiedUser, @Body() resource: ScoringConfig) {
    return this.scoringConfigService.create({ resource, user });
  }

  @Put(':id')
  update(@Param() { id }: IdParam, @Body() resource: ScoringConfig) {
    return this.scoringConfigService.update({ id, resource });
  }
}
