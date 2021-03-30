import { GroupConfig } from '@ceres/types';
import { Controller, Get, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { VerifiedUser } from '../auth/types/VerifiedUser';
import { Auth } from '../auth/decorators/auth.decorator';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  //   @Post()
  //   create(@Auth() { user }: VerifiedUser, @Body() resource: GroupConfig) {
  //     return this.groupService.create({ resource, user });
  //   }
}
