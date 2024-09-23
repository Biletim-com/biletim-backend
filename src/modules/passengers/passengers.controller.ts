import {
  Controller,
  UseGuards,
  Body,
  Get,
  Post,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@app/auth/auth.guard';
import { CurrentUser, TCurrentUser } from '@app/common/decorators';

import { Passenger } from './passenger.entity';
import { PassengersService } from './passengers.service';

// dtos
import { CreatePassengerDto } from './dtos/create-passenger.dto';
import { UpdatePassengerDto } from './dtos/update-passenger.dto';

// types
import { UUID } from '@app/common/types';

@ApiTags('Passengers')
@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @ApiOperation({ summary: 'List passengers of users' })
  @UseGuards(AuthGuard)
  @Get('')
  listPassengers(@CurrentUser() user: TCurrentUser): Promise<Passenger[]> {
    return this.passengersService.listPassengersByUserId(user.id);
  }

  @ApiOperation({ summary: 'Create user passenger' })
  @UseGuards(AuthGuard)
  @Post('')
  addPassengerToUser(
    @CurrentUser() user: TCurrentUser,
    @Body() createPassengerDto: CreatePassengerDto,
  ) {
    return this.passengersService.addPassengerToUser(
      user.id,
      createPassengerDto,
    );
  }

  @ApiOperation({ summary: 'Update passengers of user' })
  @UseGuards(AuthGuard)
  @Patch(':passengerId')
  updatePassenger(
    @CurrentUser() user: TCurrentUser,
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
  @UseGuards(AuthGuard)
  @Delete(':passengerId')
  deletePassenger(
    @CurrentUser() user: TCurrentUser,
    @Param('passengerId') passengerId: UUID,
  ) {
    return this.passengersService.deletePassenger(user.id, passengerId);
  }
}
