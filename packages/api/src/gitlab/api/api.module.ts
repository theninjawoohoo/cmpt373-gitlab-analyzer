import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('gitlabBaseUrl'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [HttpModule],
})
export class ApiModule {}
