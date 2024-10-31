import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '../users/user.entity';
import { CreditCard } from './credit-card.entity';
import { CreditCardsService } from './services/credit-cards.service';

// decorators
import { JwtAuthGuard } from '@app/common/guards';
import { CurrentUser } from '@app/common/decorators';

// dtos
import { CreateCreditCardDto } from './dto/create-credit-card-request.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card-request.dto';

// types
import { UUID } from '@app/common/types';

@ApiTags('Credit cards')
@ApiCookieAuth()
@Controller('credit-cards')
export class CreditCardController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @ApiOperation({ summary: "List user's cards" })
  @UseGuards(JwtAuthGuard)
  @Get()
  listCreditCards(@CurrentUser() currentUser: User) {
    return this.creditCardsService.listCreditCards(currentUser);
  }

  @ApiOperation({ summary: 'Create user credit card' })
  @UseGuards(JwtAuthGuard)
  @Post()
  createCreditCard(
    @CurrentUser() currentUser: User,
    @Body() creditCard: CreateCreditCardDto,
  ): Promise<CreditCard> {
    return this.creditCardsService.createCreditCard(currentUser, creditCard);
  }

  @ApiOperation({ summary: 'Update user credit card' })
  @UseGuards(JwtAuthGuard)
  @Patch(':cardId')
  updateCreditCard(
    @CurrentUser() currentUser: User,
    @Param('cardId') cardId: UUID,
    @Body() creditCardToUpdate: UpdateCreditCardDto,
  ): Promise<CreditCard> {
    return this.creditCardsService.updateCreditCard(
      currentUser,
      cardId,
      creditCardToUpdate,
    );
  }

  @ApiOperation({ summary: 'Delete user credit card' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':cardId')
  deleteCreditCard(
    @CurrentUser() currentUser: User,
    @Param('cardId') cardId: UUID,
  ): Promise<void> {
    return this.creditCardsService.deleteCreditCard(currentUser, cardId);
  }
}
