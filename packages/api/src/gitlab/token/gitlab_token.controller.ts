import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GitlabTokenService } from '../services/gitlab_token.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('token')
export class GitlabTokenController {
  constructor(private readonly tokenService: GitlabTokenService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  storeToken(@Req() req, @Body('token') token) {
    const userId: string = req.user.sub;
    const existingToken = this.tokenService.findOneByUserId(userId);
    if (existingToken) {
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
