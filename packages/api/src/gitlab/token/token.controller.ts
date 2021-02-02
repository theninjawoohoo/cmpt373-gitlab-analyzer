import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TokenService } from '../services/gitlab_token.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  storeToken(@Req() req, @Body('token') token) {
    const userId: string = req.user.sub;
    this.tokenService.create(userId, token);
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.tokenService.findOne(id);
  }
}
