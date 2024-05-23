import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create App User' })
  @Post('/create')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: any,
  ): Promise<User> {
    return await this.usersService.create(createUserDto, req?.user?.sub);
  }

  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update App User' })
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    return await this.usersService.updateUser(id, createUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    return this.usersService.delete(req?.user?.sub, id);
  }
}
