import { Controller, Get } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('sample')
  async getSampleData() {
    return (await this.connection.query("SELECT 'Sample API Call' AS text"))[0]
      .text;
  }
}
