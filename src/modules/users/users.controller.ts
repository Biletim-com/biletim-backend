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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@app/auth/auth.guard';
import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import { RequireAdmin } from '@app/common/decorators/roles.decorator';
import { UUIDv4 } from '@app/common/types';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { GetUsersQuery } from './dto/get-users-query.dto';

@ApiBearerAuth()
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Find All App Users' })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get()
  async getUsers(
    @Query() { fullName, offset, limit }: GetUsersQuery,
  ): Promise<Omit<User, 'password'>[]> {
    return this.usersService.getUsers(fullName, offset, limit);
  }

  @ApiOperation({ summary: 'Find Me App User' })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('/me')
  getMe(@CurrentUser() user: string) {
    return user;
  }

  @ApiOperation({ summary: 'Find One App User' })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('/find-one/:id')
  async findOne(@Param('id') id: UUIDv4): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Create App User' })
  @UseGuards(AuthGuard)
  @RequireAdmin()
  @HttpCode(201)
  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Update App User' })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Put('/:id')
  async updateUser(
    @Param('id') id: UUIDv4,
    @Body() createUserDto: CreateUserDto,
    @Req() req: any,
  ): Promise<any> {
    return await this.usersService.updateUser(
      req?.user?.sub,
      id,
      createUserDto,
    );
  }

  @ApiOperation({ summary: 'Delete App User' })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @RequireAdmin()
  @Delete('/:id')
  async delete(@Param('id') id: UUIDv4) {
    return this.usersService.delete(id);
  }
}
