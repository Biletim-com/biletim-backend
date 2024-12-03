export type InsuranceMakePaymentSuccessResponse = {
  success: true;
  data: string;
};
export type InsuranceMakePaymentSuccessResponseSecondOption = {
  success: true;
  data: {
    message: string;
  };
};

export type InsuranceMakePaymentErrorResponse = {
  success: false;
  data: {
    errorCode: string;
    errorMessage: string;
  };
};
export type InsuranceMakePaymentErrorResponseSecondOption = {
  success: false;
  data: {
    error: string;
  };
};

export type InsuranceMakePaymentResultResponse =
  | InsuranceMakePaymentSuccessResponse
  | InsuranceMakePaymentSuccessResponseSecondOption
  | InsuranceMakePaymentErrorResponse
  | InsuranceMakePaymentErrorResponseSecondOption;
