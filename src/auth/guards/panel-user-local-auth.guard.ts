import { AuthGuard } from '@nestjs/passport';

export class PanelUserLocalAuthGuard extends AuthGuard(
  'panel-user-local-auth',
) {}
