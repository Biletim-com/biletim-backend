import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { PaymentConfigService } from '@app/configs/payment';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { GarantiHasherService } from '../helpers/garanti-hasher.service';

// dto
import { BankCardDto } from '@app/common/dtos';

// types
import { DateTime, UUID } from '@app/common/types';
import {
  CardTokenResponse,
  CardTokenErrorResponse,
  CreateCardTokenSuccessResponse,
  DeleteCardTokenSuccessResponse,
} from '../types/card/createcard-token-response.type';
import {
  CreateCardTokenRequest,
  DeleteCardTokenRequest,
} from '../types/card/card-token-request.type';
import { RequestHeader } from '../types/headers.type';

@Injectable()
export class GarantiCardService {
  private readonly restClientService: RestClientService;
  private readonly logger = new Logger(GarantiCardService.name);

  constructor(private readonly paymentConfigService: PaymentConfigService) {
    this.restClientService = new RestClientService(
      paymentConfigService.garantiVPosBaseUrl,
    );
  }

  private handleErrorResponse(response: CardTokenErrorResponse): void {
    if (
      response.header.returnCode !== '00' ||
      response.header.reasonCode !== '00'
    ) {
      const errorMessage =
        Object.values(response.errorMap || {}).join(',') ||
        response.header.message;
      this.logger.error({ errorMessage });
      throw new BadRequestException(errorMessage);
    }
  }

  private async sendRequest<T extends CardTokenResponse>(
    path: string,
    body: CreateCardTokenRequest | DeleteCardTokenRequest,
  ): Promise<T> {
    const response = await this.restClientService.request<T>({
      method: 'POST',
      path,
      data: body,
    });

    this.handleErrorResponse(response);
    return response;
  }

  private prepareHeader(userId: UUID): RequestHeader {
    const requestId = uuidV4();
    const swtId = this.paymentConfigService.garantiSwitchId;
    const garantiUserId = userId.replaceAll('-', '');
    const timestamp = new Date(Date.now()).toISOString() as DateTime;
    const hashedData = GarantiHasherService.generateHashSha256(
      requestId,
      swtId,
      garantiUserId,
      timestamp,
      this.paymentConfigService.garantiSwitchPassword,
    );

    return {
      requestId,
      swtId,
      userId: garantiUserId,
      hashedData,
      timestamp,
    };
  }

  public async createCustomerCard(
    userId: UUID,
    card: BankCardDto,
  ): Promise<string> {
    const { userId: garantiUserId, ...header } = this.prepareHeader(userId);

    const data: CreateCardTokenRequest = {
      header: { ...header, userId: garantiUserId },
      // this is needed for generating different tokens for different users for the same card
      additionalData: garantiUserId,
      registrationType: 'F',
      card: {
        number: card.pan,
        expireMonth: String(card.expiryMonth).padStart(2, '0'),
        expireYear: String(card.expiryYear).slice(-2),
      },
    };

    const createdCardResponse =
      await this.sendRequest<CreateCardTokenSuccessResponse>(
        '/api/token/generate',
        data,
      );

    return createdCardResponse.card.token;
  }

  public async deleteCustomerCard(
    userId: UUID,
    cardToken: string,
  ): Promise<void> {
    const data: DeleteCardTokenRequest = {
      header: this.prepareHeader(userId),
      card: {
        token: cardToken,
      },
    };

    await this.sendRequest<DeleteCardTokenSuccessResponse>(
      '/api/token/removetoken',
      data,
    );
  }
}
