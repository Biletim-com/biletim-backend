import { Controller, UseGuards, Delete, Param } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// services
import { PassportsService } from './passports.service';

// entites
import { User } from '@app/modules/users/user.entity';

// decorators
import { CurrentUser } from '@app/common/decorators';

// guards
import { JwtAuthGuard } from '@app/common/guards';

// types
import { UUID } from '@app/common/types';

@ApiTags('Passports')
@ApiCookieAuth()
@Controller('passports')
export class PassportsController {
  constructor(private readonly passportsService: PassportsService) {}

  @ApiOperation({ summary: 'Delete the passport of the passenger' })
  @UseGuards(JwtAuthGuard)
  @Delete(':passportId')
  deletePassport(
    @CurrentUser() user: User,
    @Param('passportId') passportId: UUID,
  ): Promise<boolean> {
    return this.passportsService.deletePassport(user.id, passportId);
  }
}
