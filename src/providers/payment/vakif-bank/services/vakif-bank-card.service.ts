import * as dayjs from 'dayjs';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { PoxClientService } from '@app/providers/pox-client/provider.service';
import { PaymentConfigService } from '@app/configs/payment';

// decorators
import { InjectPoxClient } from '@app/providers/pox-client/decorators';

// dtos
import { CreateBankCardDto } from '@app/modules/bank-cards/dto/create-bank-card-request.dto';

// enums
import { PaymentProvider } from '@app/common/enums';
import { DateISODate, UUID } from '@app/common/types';

// types
import {
  CreateCustomerPanResponse,
  CustomerPanResponses,
  DeleteCustomerPanResponse,
  EditCustomerPanResponse,
} from '../types/card-response.type';
import { ResponseInfo } from '../types/response-info.type';

// constants
import { vPOSResponse } from '../constants/vpos-reponse.constant';

// helpers
import { VakifBankCustomerHelperService } from '../helpers/vakif-bank-customer.helper.service';

@Injectable()
export class VakifBankCardService {
  private readonly logger = new Logger(VakifBankCardService.name);

  constructor(
    @InjectPoxClient(`${PaymentProvider.VAKIF_BANK}_VPOS`)
    private readonly poxClientService: PoxClientService,
    private readonly paymentConfigService: PaymentConfigService,
  ) {}

  private extractResponseInfo<T extends CustomerPanResponses>(
    response: T,
  ): ResponseInfo {
    if ('CreateCustomerPanResponse' in response) {
      return response.CreateCustomerPanResponse.ResponseInfo;
    }
    if ('EditCustomerPanResponse' in response) {
      return response.EditCustomerPanResponse.ResponseInfo;
    }
    if ('DeleteCustomerPanResponse' in response) {
      return response.DeleteCustomerPanResponse.ResponseInfo;
    }

    throw new Error('ResponseInfo not found in response');
  }

  private async sendRequest<T extends CustomerPanResponses>(
    path: string,
    params: Record<string, any>,
  ): Promise<T> {
    const response = await this.poxClientService.request<T>({
      method: 'GET',
      path,
      params: { prmstr: params },
    });

    const responseInfo = this.extractResponseInfo(response);
    if (responseInfo.ResponseCode !== '0000') {
      const { description, detail } = vPOSResponse[responseInfo.ResponseCode];
      this.logger.error({ description, detail });

      throw new BadRequestException(responseInfo.ResponseMessage);
    }
    return response;
  }

  private get authCredentials(): {
    MerchantCriteria: { HostMerchantId: string; MerchantPassword: string };
  } {
    return {
      MerchantCriteria: {
        HostMerchantId: this.paymentConfigService.vakifBankMerchantId,
        MerchantPassword: this.paymentConfigService.vakifBankMerchantPassword,
      },
    };
  }

  async createCustomerCard(
    userId: UUID,
    bankCard: CreateBankCardDto,
  ): Promise<string> {
    const params = {
      CreateCustomerPanRequest: {
        ...this.authCredentials,
        CustomerNumber:
          VakifBankCustomerHelperService.generateVPosCustomerId(userId),
        Pan: bankCard.pan,
        ExpireDate: dayjs(bankCard.expiryDate).format('YYYYMM'),
        CardHolderName: bankCard.holderName,
      },
    };
    const createCustomerCardResponse =
      await this.sendRequest<CreateCustomerPanResponse>(
        '/UIService/CreateCustomerPan.aspx',
        params,
      );
    return createCustomerCardResponse.CreateCustomerPanResponse.PanCode;
  }

  updateCustomerCard(
    userId: UUID,
    {
      panToken,
      pan,
      expiryDate,
      holderName,
    }: {
      panToken: string;
      pan?: string;
      expiryDate?: DateISODate;
      holderName?: string;
    },
  ): Promise<EditCustomerPanResponse> {
    const params = {
      EditCustomerPanRequest: {
        ...this.authCredentials,
        CustomerNumber:
          VakifBankCustomerHelperService.generateVPosCustomerId(userId),
        PanCode: panToken,
        Pan: pan,
        ExpireDate: dayjs(expiryDate).format('YYYYMM'),
        CardHolderName: holderName,
      },
    };
    return this.sendRequest('/UIService/EditCustomerPan.aspx', params);
  }

  async deleteCustomerCard(userId: UUID, panToken: string): Promise<void> {
    const params = {
      DeleteCustomerPanRequest: {
        ...this.authCredentials,
        CustomerNumber:
          VakifBankCustomerHelperService.generateVPosCustomerId(userId),
        PanCode: panToken,
      },
    };
    await this.sendRequest<DeleteCustomerPanResponse>(
      '/UIService/DeleteCustomerPan.aspx',
      params,
    );
  }
}
