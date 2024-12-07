import { ResponseInfo } from './response-info.type';

export type CustomerPanResponse = {
  ResponseInfo: ResponseInfo;
  HostMerchantId: string;
  CustomerNumber: string;
  PanCode: string;
};

export type CreateCustomerPanResponse = {
  CreateCustomerPanResponse: CustomerPanResponse;
};

export type EditCustomerPanResponse = {
  EditCustomerPanResponse: CustomerPanResponse;
};

export type DeleteCustomerPanResponse = {
  DeleteCustomerPanResponse: CustomerPanResponse;
};

export type CustomerPanResponses =
  | CreateCustomerPanResponse
  | EditCustomerPanResponse
  | DeleteCustomerPanResponse;
