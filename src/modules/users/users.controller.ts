import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from './user.entity';
import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import { UUID } from '@app/common/types';
import { JwtAuthGuard, PanelUserJwtAuthGuard } from '@app/common/guards';

//services
import { UsersService } from './users.service';
import { PanelUsersService } from '../panel-users/panel-users.service';

//dtos
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQuery } from './dto/get-users-query.dto';
import { UserWithoutPasswordDto } from '@app/auth/dto/user-without-password.dto';

@ApiTags('Users')
@ApiCookieAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly panelUsersService: PanelUsersService,
  ) {}

  @ApiOperation({ summary: 'Find All App Users' })
  @UseGuards(PanelUserJwtAuthGuard)
  @HttpCode(200)
  @Get()
  async getUsers(
    @Query() { fullName, offset, limit }: GetUsersQuery,
  ): Promise<UserWithoutPasswordDto[]> {
    const users = await this.usersService.getUsers(
      fullName?.trim(),
      offset,
      limit,
    );
    return users.map((user) => new UserWithoutPasswordDto(user));
  }

  @ApiOperation({ summary: 'Find One App User' })
  @UseGuards(PanelUserJwtAuthGuard)
  @HttpCode(200)
  @Get('/:id')
  async findOne(@Param('id') id: UUID): Promise<UserWithoutPasswordDto> {
    const user = await this.usersService.findOne(id);
    return new UserWithoutPasswordDto(user);
  }

  @ApiOperation({ summary: 'Update App User' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Put('/:id')
  async updateUser(
    @CurrentUser() user: User,
    @Param('id') id: UUID,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    if (user.id !== id) {
      const isPanelUser = await this.panelUsersService.isPanelUser(user.id);
      if (!isPanelUser) {
        throw new UnauthorizedException(
          'You are not authorized to perform this action',
        );
      }
    }
    return this.usersService.updateUser(id, createUserDto);
  }

  @ApiOperation({ summary: 'Delete App User' })
  @UseGuards(PanelUserJwtAuthGuard)
  @HttpCode(200)
  @Delete('/:id')
  async delete(@Param('id') id: UUID) {
    await this.usersService.delete(id);
    return { message: 'user deleted' };
  }
}
