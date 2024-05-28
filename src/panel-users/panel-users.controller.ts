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
  UseGuards,
} from '@nestjs/common';
import { PanelUsersService } from './panel-users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { RequireAdmin } from 'src/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { PanelUser } from '@prisma/client';
import { CreatePanelUserDto } from './dto/create-panel-user.dto';

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
  async getUsers(@Req() req: any): Promise<PanelUser[]> {
    return this.panelUsersService.getUsers(req.query);
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
  async findOne(@Param('id') id: string): Promise<PanelUser> {
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
  async deleteAdmin(@Param('id') id: string, @Req() req: any): Promise<any> {
    return this.panelUsersService.deleteAdmin(id, req.user);
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
    @Param('id') id: string,
    @Body() createUserDto: CreatePanelUserDto,
  ): Promise<any> {
    return await this.panelUsersService.updateUser(id, createUserDto);
  }

  @ApiOperation({ summary: 'Delete Panel User' })
  @UseGuards(AuthGuard)
  @RequireAdmin()
  @HttpCode(200)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
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
      req?.user?.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }


  // @ApiOperation({ summary: 'Create panel admin (Only SUPER ADMIN can use)' })
  // @Post('/create-super-admin')
  // @HttpCode(201)
  // async createSuperAdmin(
  // ): Promise<any> {
  //   return this.panelUsersService.createSuperAdmin(

  //   );
  // }
}
