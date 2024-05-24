import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PanelUsersService } from './panel-users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('panel')
@ApiTags('Panel-users')
export class PanelUsersController {
  constructor(private readonly panelUsersService: PanelUsersService) {}

  @ApiOperation({ summary: 'Create panel admin (Only SUPER ADMIN can use)' })
  @UseGuards(AuthGuard)
  @Post('/create-admin')
  @HttpCode(201)
  async createPanelAdmin(
    @Body() createPanelAdminDto: CreateUserDto,
    @Req() req: any,
  ): Promise<any> {
    return this.panelUsersService.createPanelAdmin(
      createPanelAdminDto,
      req?.user?.sub,
    );
  }

  @ApiOperation({
    summary: 'Panel Change Password ',
  })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Put('/change-password')
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


  @ApiOperation({ summary: 'Create panel admin (Only SUPER ADMIN can use)' })
  @UseGuards(AuthGuard)
  @Post('/create-super-admin')
  @HttpCode(201)
  async createSuperAdmin(
  ): Promise<any> {
    return this.panelUsersService.createSuperAdmin(

    );
  }
}
