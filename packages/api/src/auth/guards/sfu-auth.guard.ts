import { AuthGuard } from '@nestjs/passport';

export class SfuAuthGuard extends AuthGuard('sfu') {}
