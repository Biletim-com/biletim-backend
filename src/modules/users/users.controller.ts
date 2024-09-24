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

import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import { UUID } from '@app/common/types';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { GetUsersQuery } from './dto/get-users-query.dto';
import { JwtAuthGuard, PanelUserJwtAuthGuard } from '@app/common/guards';
import { PanelUsersService } from '../panel-users/panel-users.service';

@ApiTags('Users')
@ApiCookieAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly panelUsersService: PanelUsersService,
  ) {}

  @ApiOperation({ summary: 'Find All App Users' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get()
  async getUsers(
    @Query() { fullName, offset, limit }: GetUsersQuery,
  ): Promise<Omit<User, 'password'>[]> {
    return this.usersService.getUsers(fullName?.trim(), offset, limit);
  }

  @ApiOperation({ summary: 'Find Me App User' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/me')
  getMe(@CurrentUser() user: string) {
    return user;
  }

  @ApiOperation({ summary: 'Find One App User' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/find-one/:id')
  async findOne(@Param('id') id: UUID): Promise<Omit<User, 'password'>> {
    return await this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Create App User' })
  @UseGuards(PanelUserJwtAuthGuard)
  @HttpCode(201)
  @Post('/create')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return await this.usersService.create(createUserDto);
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
    return await this.usersService.updateUser(id, createUserDto);
  }

  @ApiOperation({ summary: 'Delete App User' })
  @UseGuards(PanelUserJwtAuthGuard)
  @HttpCode(200)
  @Delete('/:id')
  async delete(@Param('id') id: UUID) {
    return this.usersService.delete(id);
  }
}
