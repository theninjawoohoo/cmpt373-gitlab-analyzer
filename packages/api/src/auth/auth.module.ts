import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GitlabModule } from '../gitlab/gitlab.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './services/auth.service';
import { SfuService } from './services/sfu.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SfuStrategy } from './strategies/sfu.strategy';
import { AuthController } from './auth.controller';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwtSigningKey'),
        signOptions: { expiresIn: configService.get('jwtAuthExpiryPeriod') },
      }),
      inject: [ConfigService],
    }),
    GitlabModule,
    UserModule,
    RepositoryModule,
  ],
  providers: [SfuStrategy, SfuService, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
