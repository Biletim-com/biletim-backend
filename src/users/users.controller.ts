import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RequireAdmin } from '../decorators/roles.decorator';

@ApiBearerAuth()
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Find All App Users' })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get()
  async getUsers(@Req() req: any): Promise<User[]> {
    return this.usersService.getUsers(req.query);
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
  async findOne(@Param('id') id: string): Promise<User> {
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
    @Param('id') id: string,
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
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
