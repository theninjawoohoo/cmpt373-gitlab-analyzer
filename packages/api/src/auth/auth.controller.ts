import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { SfuAuthGuard } from './guards/sfu-auth.guard';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(SfuAuthGuard)
  @Public()
  @Post('login/sfu')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
