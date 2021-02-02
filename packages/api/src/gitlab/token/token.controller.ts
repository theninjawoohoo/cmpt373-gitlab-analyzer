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
    this.tokenService.create(token);
  }

  @Get(':id')
  findOne(@Param('id') id): string {
    return this.tokenService.findOne(id);
  }
}
