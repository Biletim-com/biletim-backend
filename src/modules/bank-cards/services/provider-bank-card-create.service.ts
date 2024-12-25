import { Injectable, Logger } from '@nestjs/common';

// entites
import { User } from '@app/modules/users/user.entity';

// services
import { VakifBankCardService } from '@app/providers/payment/vakif-bank/services/vakif-bank-card.service';
import { VakifBankCustomerService } from '@app/providers/payment/vakif-bank/services/vakif-bank-customer.service';
import { GarantiCardService } from '@app/providers/payment/garanti/services/garanti-card.service';

// dto
import { CreateBankCardDto } from '../dto/create-bank-card-request.dto';

// types
import { UUID } from '@app/common/types';

// errors
import { ServiceError } from '@app/common/errors';

@Injectable()
export class ProvidersBankCardService {
  private readonly logger = new Logger(ProvidersBankCardService.name);

  constructor(
    private readonly vakifBankCardService: VakifBankCardService,
    private readonly vakifBankCustomerService: VakifBankCustomerService,
    private readonly garantiBankCardService: GarantiCardService,
  ) {}

  async createCustomerCards(
    createBankCardDto: CreateBankCardDto,
    existingUser: User,
    userHasCard: boolean,
  ): Promise<[string, string]> {
    try {
      const customerId = this.vakifBankCustomerService.generateVPosCustomerId(
        existingUser.id,
      );
      if (!userHasCard) {
        await this.vakifBankCustomerService.createCustomer({
          ...existingUser,
          id: customerId as UUID,
        });
      }

      const results = await Promise.allSettled([
        this.vakifBankCardService.createCustomerCard(
          customerId,
          createBankCardDto,
        ),
        Promise.resolve('do-not-use-this-token'),
        // this.garantiBankCardService.createCustomerCard(
        //   existingUser.id,
        //   createBankCardDto,
        // ),
      ]);

      const [vakifBankResult, garantiBankResult] = results;

      let vakifBankCardToken: string | null = null;
      let garantiCardToken: string | null = null;

      // handle vakif bank card creation
      if (vakifBankResult.status === 'fulfilled') {
        vakifBankCardToken = vakifBankResult.value;
      } else {
        this.logger.error(
          `failed to create VakifBank card token ${vakifBankResult.reason}`,
        );
        if (garantiBankResult.status === 'fulfilled') {
          await this.rollbackGarantiBankCard(
            existingUser.id,
            garantiBankResult.value,
          );
        }
      }

      // handle garanti card creation
      if (garantiBankResult.status === 'fulfilled') {
        garantiCardToken = garantiBankResult.value;
      } else {
        this.logger.error(
          `failed to create Garanti card token: ${garantiBankResult.reason}`,
        );
        if (vakifBankResult.status === 'fulfilled') {
          await this.rollbackVakifBankCard(
            existingUser.id,
            vakifBankResult.value,
          );
        }
      }

      if (!vakifBankCardToken || !garantiCardToken) {
        throw new Error('failed to create provider customer cards');
      }

      return [vakifBankCardToken, garantiCardToken];
    } catch (error) {
      this.logger.error(
        `error occurred while creating customer cards: ${error.message}`,
      );
      throw new ServiceError('failed to create customer cards');
    }
  }

  public deleteCustomerCards(
    userId: UUID,
    vakifBankToken: string,
    garantiToken: string,
  ) {
    return Promise.all([
      this.rollbackVakifBankCard(userId, vakifBankToken),
      this.rollbackGarantiBankCard(userId, garantiToken),
    ]);
  }

  private async rollbackVakifBankCard(
    userId: UUID,
    cardToken: string,
  ): Promise<void> {
    try {
      const customerId =
        this.vakifBankCustomerService.generateVPosCustomerId(userId);
      await this.vakifBankCardService.deleteCustomerCard(customerId, cardToken);
      this.logger.log(
        `successfully rolled back VakifBank card with token ${cardToken}`,
      );
    } catch (error) {
      this.logger.error(
        `failed to roll back VakifBank card with token: ${cardToken}, error: ${error.message}`,
      );
    }
  }

  private async rollbackGarantiBankCard(
    userId: UUID,
    cardToken: string,
  ): Promise<void> {
    try {
      await this.garantiBankCardService.deleteCustomerCard(userId, cardToken);
      this.logger.log(
        `successfully rolled back GarantiBank card with token ${cardToken}`,
      );
    } catch (error) {
      this.logger.error(
        `failed to roll back GarantiBank card with token ${cardToken}, error: ${error.message}`,
      );
    }
  }
}
