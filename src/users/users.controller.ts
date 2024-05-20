import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePanelAdminDto } from './dto/create-panel-admin.dto';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // @Post()
  // async create(@Body() createUserDto: any, @Request() req: any) {
  //   this.usersService.create(createUserDto, req.user as any);
  // }
  // @Get()
  // async findAll(@Request() req: any) {
  //   return this.usersService.findAll(req.user as any);
  // }

  // @Get(':id')
  // async findOne(@Request() req: any, @Param('id') id: string) {
  //   return this.usersService.findOne(req.user as any, id);
  // }

  // @Patch(':id')
  // async update(
  //   @Request() req: any,
  //   @Param('id') id: string,
  //   @Body() data: any,
  // ) {
  //   return this.usersService.update(req.user, id, data);
  // }

  // @Delete(':id')
  // async remove(@Request() req: any, @Param('id') id: string) {
  //   return this.usersService.remove(req.user, id);
  // }

  // @Get('me')
  // async me(@Request() req: any) {
  //   return this.usersService.me(req.user as any);
  // }

  // @ApiOperation({ summary: 'Create panel admin (Only SUPER ADMIN can use)' })
  // @UseGuards(AuthGuard)
  // @Post('/create-panel-admin')
  // @HttpCode(201)
  // async createPanelAdmin(
  //   @Body() createPanelAdminDto: CreatePanelAdminDto,
  //   @Req() req: any,
  // ): Promise<any> {
  //   return this.usersService.createPanelAdmin(
  //     req?.user?.id,
  //     createPanelAdminDto,
  //   );
  // }
}
