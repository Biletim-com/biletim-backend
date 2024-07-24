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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@app/auth/auth.guard';
import { ChangePasswordDto } from '@app/auth/dto/change-password.dto';
import { RequireAdmin, CurrentUser } from '@app/common/decorators';
import { UUIDv4 } from '@app/common/types';

import { PanelUser } from './panel-user.entity';
import { PanelUsersService } from './panel-users.service';
import { CreatePanelUserDto } from './dto/create-panel-user.dto';
import { GetPanelUsersQuery } from './dto/get-panel-users-query.dto';

@ApiBearerAuth()
@Controller('panel')
@ApiTags('Panel-Users')
export class PanelUsersController {
  constructor(private readonly panelUsersService: PanelUsersService) {}

  @ApiOperation({ summary: 'Find All Panel Users' })
  @UseGuards(AuthGuard)
  @RequireAdmin()
  @HttpCode(200)
  @Get('/all')
  async getUsers(
    @Query() { fullName, offset, limit }: GetPanelUsersQuery,
  ): Promise<Omit<PanelUser, 'password'>[]> {
    return this.panelUsersService.getUsers(fullName?.trim(), offset, limit);
  }

  @ApiOperation({ summary: 'Find Me Panel User' })
  @UseGuards(AuthGuard)
  @RequireAdmin()
  @HttpCode(200)
  @Get('/me')
  getMe(@CurrentUser() user: any): Promise<any> {
    return user;
  }

  @ApiOperation({ summary: 'Find One Panel User' })
  @UseGuards(AuthGuard)
  @RequireAdmin()
  @HttpCode(200)
  @Get('/find-one/:id')
  async findOne(@Param('id') id: UUIDv4): Promise<PanelUser> {
    return await this.panelUsersService.findOne(id);
  }

  @ApiOperation({ summary: 'Create SUPER ADMIN For Panel' })
  @Post('/create-super-admin/:key')
  @HttpCode(201)
  async createSuperAdmin(@Param('key') key: string): Promise<any> {
    return this.panelUsersService.createSuperAdmin(key);
  }

  @ApiOperation({ summary: 'Delete SUPER ADMIN )' })
  @UseGuards(AuthGuard)
  @RequireAdmin()
  @Delete('/super-admin/:id')
  @HttpCode(201)
  async deleteAdmin(
    @Param('id') id: UUIDv4,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.panelUsersService.deleteAdmin(id, user);
  }

  @ApiOperation({ summary: 'Create panel admin (Only SUPER ADMIN can use)' })
  @UseGuards(AuthGuard)
  @RequireAdmin()
  @Post('/create-admin')
  @HttpCode(201)
  async createPanelAdmin(
    @Body() createPanelAdminDto: CreatePanelUserDto,
  ): Promise<any> {
    return this.panelUsersService.createPanelAdmin(createPanelAdminDto);
  }

  @ApiOperation({ summary: 'Update Panel User' })
  @UseGuards(AuthGuard)
  @RequireAdmin()
  @HttpCode(200)
  @Put('/:id')
  async updateUser(
    @Param('id') id: UUIDv4,
    @Body() createUserDto: CreatePanelUserDto,
  ): Promise<any> {
    return await this.panelUsersService.updateUser(id, createUserDto);
  }

  @ApiOperation({ summary: 'Delete Panel User' })
  @UseGuards(AuthGuard)
  @RequireAdmin()
  @HttpCode(200)
  @Delete('/:id')
  async delete(@Param('id') id: UUIDv4) {
    return this.panelUsersService.delete(id);
  }

  @ApiOperation({
    summary: 'Panel Change Password ',
  })
  @UseGuards(AuthGuard)
  @RequireAdmin()
  @HttpCode(200)
  @Patch('/change-password')
  async panelChangePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ): Promise<any> {
    return this.panelUsersService.panelChangePassword(
      req?.user?.sub,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}
