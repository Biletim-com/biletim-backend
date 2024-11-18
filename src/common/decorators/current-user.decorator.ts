import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '@app/modules/users/user.entity';
import { PanelUser } from '@app/modules/panel-users/panel-user.entity';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as User | PanelUser;
  },
);
