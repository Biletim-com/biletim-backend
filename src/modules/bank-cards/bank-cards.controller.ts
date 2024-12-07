import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '../users/user.entity';
import { BankCard } from './bank-card.entity';
import { BankCardsService } from './services/bank-cards.service';

// decorators
import { JwtAuthGuard } from '@app/common/guards';
import { CurrentUser } from '@app/common/decorators';

// dtos
import { CreateBankCardDto } from './dto/create-bank-card-request.dto';

// types
import { UUID } from '@app/common/types';

@ApiTags('Bank cards')
@ApiCookieAuth()
@Controller('bank-cards')
export class BankCardController {
  constructor(private readonly bankCardsService: BankCardsService) {}

  @ApiOperation({ summary: "List user's cards" })
  @UseGuards(JwtAuthGuard)
  @Get()
  listBankCards(@CurrentUser() currentUser: User) {
    return this.bankCardsService.listBankCards(currentUser);
  }

  @ApiOperation({ summary: 'Create user bank card' })
  @UseGuards(JwtAuthGuard)
  @Post()
  createBankCard(
    @CurrentUser() currentUser: User,
    @Body() bankCard: CreateBankCardDto,
  ): Promise<BankCard> {
    return this.bankCardsService.createBankCard(currentUser, bankCard);
  }

  @ApiOperation({ summary: 'Delete user bank card' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':cardId')
  deleteBankCard(
    @CurrentUser() currentUser: User,
    @Param('cardId') cardId: UUID,
  ): Promise<void> {
    return this.bankCardsService.deleteBankCard(currentUser, cardId);
  }
}
