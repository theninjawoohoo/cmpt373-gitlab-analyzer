import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { VerifiedUser } from '../../auth/types/VerifiedUser';
import { GitlabTokenService } from '../services/gitlab_token.service';
import { Auth } from '../../auth/decorators/auth.decorator';

@Controller('token')
export class GitlabTokenController {
  constructor(private readonly tokenService: GitlabTokenService) {}

  @Post()
  @HttpCode(204)
  async storeToken(@Auth() user: VerifiedUser, @Body('token') token) {
    const userId: string = user.sub;
    if (user.gitlabToken) {
      await this.tokenService.update(userId, token);
    } else {
      await this.tokenService.create(userId, token);
    }
  }

  @Get('verify')
  async verify(@Auth() user: VerifiedUser) {
    const token = await this.tokenService.findOneByUserId(user.sub);
    if (token && !token.expired) {
      return { verified: true };
    }
    return { verified: false };
  }
}
