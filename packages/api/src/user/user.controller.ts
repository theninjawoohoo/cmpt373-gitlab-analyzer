import { Body, Controller, Post } from '@nestjs/common';
import { SfuLoginDto } from './dtos/sfu-login.dto';
import { SfuService } from './services/sfu.service';

@Controller('user')
export class UserController {
  constructor(private readonly sfuService: SfuService) {}

  @Post('login')
  async login(@Body() sfuLoginDto: SfuLoginDto) {
    return this.sfuService.getUserIdForTicket(sfuLoginDto.ticket);
  }
}
