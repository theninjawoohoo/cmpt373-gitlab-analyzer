import { Controller, Get } from '@nestjs/common';
import { Connection } from 'typeorm';

@Controller('sample')
export class SampleController {
  constructor(private readonly connection: Connection) {}

  @Get()
  async getSampleData() {
    return (await this.connection.query("SELECT 'Sample API Call' AS text"))[0]
      .text;
  }
}
