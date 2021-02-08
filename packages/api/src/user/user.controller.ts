import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { GitlabToken } from '../auth/decorators/gitlab-token.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerifiedUser } from '../auth/types/VerifiedUser';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    const userId: string = req.user.sub;
    return this.userService.getProfileById(userId);
  }

  @Post('update')
  updateProfile(@Auth() verifiedUser: VerifiedUser, @GitlabToken() token) {
    return this.userService.updateWithGitlab(verifiedUser.user, token);
  }
}
