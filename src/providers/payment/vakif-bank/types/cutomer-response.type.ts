import { ResponseInfo } from './response-info.type';

type CustomerResponse = {
  ResponseInfo: ResponseInfo;
  HostMerchantId: string;
  CustomerNumber: string;
};

export type CreateCustomerResponse = {
  CreateCustomerResponse: CustomerResponse;
};

export type EditCustomerResponse = {
  EditCustomerResponse: CustomerResponse;
};

export type CustomerResponses = CreateCustomerResponse | EditCustomerResponse;
