import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async create(@Body() createUserDto: any, @Request() req: any) {
    this.usersService.create(createUserDto, req.user as any);
  }
  @Get()
  async findAll(@Request() req: any) {
    return this.usersService.findAll(req.user as any);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.usersService.findOne(req.user as any, id);
  }

  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.usersService.update(req.user, id, data);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.usersService.remove(req.user, id);
  }

  @Get('me')
  async me(@Request() req: any) {
    return this.usersService.me(req.user as any);
  }
}
