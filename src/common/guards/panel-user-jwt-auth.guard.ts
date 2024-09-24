import { AuthGuard } from '@nestjs/passport';

export class PanelUserJwtAuthGuard extends AuthGuard('panel-user-jwt-auth') {}
