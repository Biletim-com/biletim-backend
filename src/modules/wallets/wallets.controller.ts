import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// services
import { WalletsService } from './wallets.service';

// entities
import { Wallet } from './wallet.entity';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';

// decorators
import { CurrentUser } from '@app/common/decorators/current-user.decorator';

// guards
import { JwtAuthGuard } from '@app/common/guards';

// dtos
import { WalletTransactionHistoryDto } from './dto/wallet-transaction-history.dto';
import { ListResponseDto } from '@app/common/dtos';

@ApiTags('Wallet')
@ApiCookieAuth()
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletsService: WalletsService) {}

  @ApiOperation({ summary: 'Get My Wallet ' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyWallet(@CurrentUser() currentUser: User): Promise<Wallet> {
    return this.walletsService.getMyWallet(currentUser.id);
  }

  @ApiOperation({ summary: 'Get Transaction History Of My Wallet' })
  @UseGuards(JwtAuthGuard)
  @Get('/transaction-history')
  async getTransactionHistory(
    @Query() dto: WalletTransactionHistoryDto,
    @CurrentUser() currentUser: User,
  ): Promise<ListResponseDto<Transaction>> {
    return this.walletsService.getTransactionHistory(currentUser.id, dto);
  }
}
