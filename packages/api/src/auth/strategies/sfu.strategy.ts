import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../../user/services/user.service';
import { PASSPORT_STRATEGY_SFU } from '../auth.constants';
import { SfuService } from '../services/sfu.service';

@Injectable()
export class SfuStrategy extends PassportStrategy(
  Strategy,
  PASSPORT_STRATEGY_SFU,
) {
  constructor(
    private readonly sfuService: SfuService,
    private readonly userService: UserService,
  ) {
    super({ usernameField: 'ticket', passwordField: 'ticket' });
  }

  async validate(ticket: string) {
    const userId = await this.sfuService.getUserIdForTicket(ticket);
    let user = await this.userService.findBySfuId(userId);
    if (!user) {
      user = await this.userService.createSfuUser(userId);
    }
    return {
      sub: user.id,
    };
  }
}
