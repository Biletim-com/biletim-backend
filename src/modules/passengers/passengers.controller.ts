import {
  Controller,
  UseGuards,
  Body,
  Get,
  Post,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@app/common/decorators';

import { User } from '../users/user.entity';
import { Passenger } from './passenger.entity';
import { PassengersService } from './passengers.service';

// guards
import { JwtAuthGuard } from '@app/common/guards';

// dtos
import { CreatePassengerDto } from './dtos/create-passenger.dto';
import { UpdatePassengerDto } from './dtos/update-passenger.dto';

// types
import { UUID } from '@app/common/types';

@ApiTags('Passengers')
@ApiCookieAuth()
@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @ApiOperation({ summary: 'List passengers of users' })
  @UseGuards(JwtAuthGuard)
  @Get()
  listPassengers(@CurrentUser() user: User): Promise<Passenger[]> {
    return this.passengersService.listPassengersByUserId(user.id);
  }

  @ApiOperation({ summary: 'Create user passenger' })
  @UseGuards(JwtAuthGuard)
  @Post()
  addPassengerToUser(
    @CurrentUser() user: User,
    @Body() createPassengerDto: CreatePassengerDto,
  ) {
    return this.passengersService.addPassengerToUser(
      user.id,
      createPassengerDto,
    );
  }

  @ApiOperation({ summary: 'Update passengers of user' })
  @UseGuards(JwtAuthGuard)
  @Patch(':passengerId')
  updatePassenger(
    @CurrentUser() user: User,
    @Param('passengerId') passengerId: UUID,
    @Body() updatePassengerDto: UpdatePassengerDto,
  ) {
    return this.passengersService.updatePassenger(
      user.id,
      passengerId,
      updatePassengerDto,
    );
  }

  @ApiOperation({ summary: 'Delete passenger of user' })
  @UseGuards(JwtAuthGuard)
  @Delete(':passengerId')
  deletePassenger(
    @CurrentUser() user: User,
    @Param('passengerId') passengerId: UUID,
  ): Promise<boolean> {
    return this.passengersService.deletePassenger(user.id, passengerId);
  }
}
