import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VerifiedUser } from '../../auth/types/VerifiedUser';
import { GitlabTokenService } from '../services/gitlab_token.service';
import { Auth } from '../../auth/decorators/auth.decorator';

@Controller('token')
export class GitlabTokenController {
  constructor(private readonly tokenService: GitlabTokenService) {}

  @Post()
  storeToken(@Auth() user: VerifiedUser, @Body('token') token) {
    const userId: string = user.sub;
    if (user.gitlabToken) {
      return this.tokenService.update(userId, token);
    } else {
      return this.tokenService.create(userId, token);
    }
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.tokenService.findOne(id);
  }
}
