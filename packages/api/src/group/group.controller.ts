import { GroupConfig } from '@ceres/types';
import { Controller, Get, Post, Put } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { IdParam } from '../common/id-param';
import { Body, Query } from '@nestjs/common';
import { VerifiedUser } from '../auth/types/VerifiedUser';
import { Auth } from '../auth/decorators/auth.decorator';
import { GroupService } from './group.service';
import { GroupQueryDto } from './group-query.dto';
import { paginatedToResponse } from '../common/pagination';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @Get()
  search(@Auth() { user }: VerifiedUser, @Query() query: GroupQueryDto) {
    return this.groupService.search({ ...query, user });
  }

  @Get(':id')
  findOne(@Param() { id }: IdParam) {
    return this.groupService.findOne(id);
  }

  @Post()
  create(@Auth() { user }: VerifiedUser, @Body() resource: GroupConfig) {
    return this.groupService.create({ resource, user });
  }

  @Put(':id')
  update(@Param() { id }: IdParam, @Body() resource: GroupConfig) {
    return this.groupService.update({ id, resource });
  }
}
