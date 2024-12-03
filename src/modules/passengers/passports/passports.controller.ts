import {
  Controller,
  UseGuards,
  Body,
  Delete,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// entities
import { Passport } from './passport.entity';

// services
import { PassportsService } from './passports.service';

// entites
import { User } from '@app/modules/users/user.entity';

// decorators
import { CurrentUser } from '@app/common/decorators';

// guards
import { JwtAuthGuard } from '@app/common/guards';

// dtos
import { AddPassportDto } from './dto/add-passport.dto';
import { UpdatePassportDto } from './dto/update-passport.dto';

// types
import { UUID } from '@app/common/types';

@ApiTags('Passports')
@ApiCookieAuth()
@Controller('passports')
export class PassportsController {
  constructor(private readonly passportsService: PassportsService) {}

  @ApiOperation({ summary: 'Update passengers of user' })
  @UseGuards(JwtAuthGuard)
  @Post()
  addPassport(
    @CurrentUser() user: User,
    @Body() { passengerId, passport }: AddPassportDto,
  ): Promise<Passport> {
    return this.passportsService.addPassportToPassenger(
      user.id,
      passengerId,
      passport,
    );
  }

  @ApiOperation({ summary: 'Update the passport of the passenger' })
  @UseGuards(JwtAuthGuard)
  @Patch(':passportId')
  updatePassport(
    @CurrentUser() user: User,
    @Param('passportId') passportId: UUID,
    @Body() updatePassportDto: UpdatePassportDto,
  ) {
    return this.passportsService.updatePassport(
      user.id,
      passportId,
      updatePassportDto,
    );
  }

  @ApiOperation({ summary: 'Delete the passport of the passenger' })
  @UseGuards(JwtAuthGuard)
  @Delete(':passportId')
  deletePassport(
    @CurrentUser() user: User,
    @Param('passportId') passportId: UUID,
  ) {
    return this.passportsService.deletePassport(user.id, passportId);
  }
}
