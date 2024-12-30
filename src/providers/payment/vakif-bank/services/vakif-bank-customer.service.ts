import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { User } from '@app/modules/users/user.entity';

import { PoxClientService } from '@app/providers/pox-client/provider.service';
import { PaymentConfigService } from '@app/configs/payment';

// decorators
import { InjectPoxClient } from '@app/providers/pox-client/decorators';

// enums
import { PaymentProvider } from '@app/common/enums';
import { vPOSResponse } from '../constants/vpos-reponse.constant';

// types
import { ResponseInfo } from '../types/response-info.type';
import {
  CreateCustomerResponse,
  CustomerResponses,
  EditCustomerResponse,
} from '../types/cutomer-response.type';

// helpers
import { VakifBankCustomerHelperService } from '../helpers/vakif-bank-customer.helper.service';

@Injectable()
export class VakifBankCustomerService {
  private readonly logger = new Logger(VakifBankCustomerService.name);

  constructor(
    @InjectPoxClient(`${PaymentProvider.VAKIF_BANK}_VPOS`)
    private readonly poxClientService: PoxClientService,
    private readonly paymentConfigService: PaymentConfigService,
  ) {}

  private extractResponseInfo<T extends CustomerResponses>(
    response: T,
  ): ResponseInfo {
    if ('CreateCustomerResponse' in response) {
      return response.CreateCustomerResponse.ResponseInfo;
    }
    if ('EditCustomerResponse' in response) {
      return response.EditCustomerResponse.ResponseInfo;
    }

    throw new Error('ResponseInfo not found in response');
  }

  private async sendRequest<T extends CustomerResponses>(
    path: string,
    params: Record<string, any>,
  ): Promise<T> {
    const response = await this.poxClientService.request<T>({
      method: 'GET',
      path,
      params: { prmstr: params },
    });

    const responseInfo = this.extractResponseInfo(response);
    if (
      responseInfo.ResponseCode !== '0000' &&
      // ignore duplicate user creation
      responseInfo.ResponseCode !== '9110'
    ) {
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

  async createCustomer(user: User): Promise<CreateCustomerResponse> {
    const fullName = [user.name, user.familyName].filter(Boolean).join(' ');

    const params = {
      CreateCustomerRequest: {
        ...this.authCredentials,
        CustomerNumber: VakifBankCustomerHelperService.generateVPosCustomerId(
          user.id,
        ),
        Name: fullName,
        FatherName: '',
        Address: user.address,
        CityName: '',
        TownName: '',
        Phone: user.phone,
        MobilePhone: user.phone,
        EmailAddress: user.email,
      },
    };
    return this.sendRequest('/UIService/CreateCustomer.aspx', params);
  }

  updateCustomer(): Promise<EditCustomerResponse> {
    const params = {
      EditCustomerRequest: {
        ...this.authCredentials,
        CustomerNumber: 'müşteri1',
        Name: 'Serdar Metin',
        FatherName: 'BabaAdı',
        Address: 'Vakıfbank',
        CityName: 'İstanbul',
        TownName: 'Türkiye',
        Phone: '902124443322',
        MobilePhone: '905854443322',
        EmailAddress: 'vpos724@vakifbank.com.tr',
      },
    };
    return this.sendRequest<EditCustomerResponse>(
      '/UIService/EditCustomer.aspx',
      params,
    );
  }
}
