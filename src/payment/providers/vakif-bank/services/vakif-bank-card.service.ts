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
import { DateISODate } from '@app/common/types';

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
        HostMerchantId: this.paymentConfigService.merchantId,
        MerchantPassword: this.paymentConfigService.merchantPassword,
      },
    };
  }

  async createCustomerCard(
    userId: string,
    bankCard: CreateBankCardDto,
  ): Promise<CreateCustomerPanResponse> {
    const params = {
      CreateCustomerPanRequest: {
        ...this.authCredentials,
        CustomerNumber: userId,
        Pan: bankCard.pan,
        ExpireDate: dayjs(bankCard.expiryDate).format('YYYYMM'),
        CardHolderName: bankCard.holderName,
      },
    };
    return this.sendRequest('/UIService/CreateCustomerPan.aspx', params);
  }

  updateCustomerCard(
    userId: string,
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
        CustomerNumber: userId,
        PanCode: panToken,
        Pan: pan,
        ExpireDate: dayjs(expiryDate).format('YYYYMM'),
        CardHolderName: holderName,
      },
    };
    return this.sendRequest('/UIService/EditCustomerPan.aspx', params);
  }

  deleteCustomerCard(
    userId: string,
    panToken: string,
  ): Promise<DeleteCustomerPanResponse> {
    const params = {
      DeleteCustomerPanRequest: {
        ...this.authCredentials,
        CustomerNumber: userId,
        PanCode: panToken,
      },
    };
    return this.sendRequest('/UIService/DeleteCustomerPan.aspx', params);
  }
}
