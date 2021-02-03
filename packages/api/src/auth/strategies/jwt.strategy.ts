import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GitlabTokenService } from '../../gitlab/services/gitlab_token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private gitlabTokenService: GitlabTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSigningKey'),
    });
  }

  async validate(payload: any) {
    const gitlabToken = await this.gitlabTokenService.findOneByUserId(
      payload.sub,
    );
    if (gitlabToken) {
      payload.gitlabToken = gitlabToken.token;
    }
    return payload;
  }
}
