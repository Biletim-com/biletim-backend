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
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ChangePasswordDto } from '@app/auth/dto/change-password.dto';
import { CurrentUser } from '@app/common/decorators';
import { UUID } from '@app/common/types';
import { PanelUserJwtAuthGuard } from '@app/common/guards/panel-user-jwt-auth.guard';

// dtos
import { PanelUsersService } from './panel-users.service';
import { CreatePanelUserDto } from './dto/create-panel-user.dto';
import { GetPanelUsersQuery } from './dto/get-panel-users-query.dto';
import { PanelUserWithoutPasswordDto } from './dto/panel-user-without-password.dto';

@ApiTags('Panel-Users')
@ApiCookieAuth()
@Controller('panel')
export class PanelUsersController {
  constructor(private readonly panelUsersService: PanelUsersService) {}

  @ApiOperation({ summary: 'Find All Panel Users' })
  @UseGuards(PanelUserJwtAuthGuard)
  @HttpCode(200)
  @Get('/all')
  async getUsers(
    @Query() { fullName, offset, limit }: GetPanelUsersQuery,
  ): Promise<PanelUserWithoutPasswordDto[]> {
    const users = await this.panelUsersService.getUsers(
      fullName?.trim(),
      offset,
      limit,
    );
    return users.map((user) => new PanelUserWithoutPasswordDto(user));
  }

  @ApiOperation({ summary: 'Find Me Panel User' })
  @UseGuards(PanelUserJwtAuthGuard)
  @HttpCode(200)
  @Get('/me')
  getMe(@CurrentUser() user: any): Promise<any> {
    return user;
  }

  @ApiOperation({ summary: 'Find One Panel User' })
  @UseGuards(PanelUserJwtAuthGuard)
  @HttpCode(200)
  @Get('/find-one/:id')
  async findOne(@Param('id') id: UUID): Promise<PanelUserWithoutPasswordDto> {
    const user = await this.panelUsersService.findOne(id);
    return new PanelUserWithoutPasswordDto(user);
  }

  @ApiOperation({ summary: 'Create SUPER ADMIN For Panel' })
  @Post('/create-super-admin/:key')
  @HttpCode(201)
  async createSuperAdmin(@Param('key') key: string): Promise<any> {
    return this.panelUsersService.createSuperAdmin(key);
  }

  @ApiOperation({ summary: 'Delete SUPER ADMIN )' })
  @UseGuards(PanelUserJwtAuthGuard)
  @Delete('/super-admin/:id')
  @HttpCode(201)
  async deleteAdmin(
    @Param('id') id: UUID,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.panelUsersService.deleteAdmin(id, user);
  }

  @ApiOperation({ summary: 'Create panel admin (Only SUPER ADMIN can use)' })
  @UseGuards(PanelUserJwtAuthGuard)
  @Post('/create-admin')
  @HttpCode(201)
  async createPanelAdmin(
    @Body() createPanelAdminDto: CreatePanelUserDto,
  ): Promise<PanelUserWithoutPasswordDto> {
    const user = await this.panelUsersService.createPanelAdmin(
      createPanelAdminDto,
    );
    return new PanelUserWithoutPasswordDto(user);
  }

  @ApiOperation({ summary: 'Update Panel User' })
  @UseGuards(PanelUserJwtAuthGuard)
  @HttpCode(200)
  @Put('/:id')
  async updateUser(
    @Param('id') id: UUID,
    @Body() createUserDto: CreatePanelUserDto,
  ): Promise<any> {
    return await this.panelUsersService.updateUser(id, createUserDto);
  }

  @ApiOperation({ summary: 'Delete Panel User' })
  @UseGuards(PanelUserJwtAuthGuard)
  @HttpCode(200)
  @Delete('/:id')
  async delete(@Param('id') id: UUID) {
    return this.panelUsersService.delete(id);
  }

  @ApiOperation({
    summary: 'Panel Change Password ',
  })
  @UseGuards(PanelUserJwtAuthGuard)
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
