import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@app/common/guards';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Wallet } from './wallet.entity';
import { WalletsService } from './wallets.service';
import { Transaction } from '../transactions/transaction.entity';

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

  @ApiOperation({ summary: 'Get Transaction History Of My Wallet ' })
  @UseGuards(JwtAuthGuard)
  @Get('/transaction-history')
  async getTransactionHistory(
    @CurrentUser() currentUser: User,
  ): Promise<Transaction | Transaction[]> {
    return this.walletsService.getTransactionHistory(currentUser.id);
  }
}
