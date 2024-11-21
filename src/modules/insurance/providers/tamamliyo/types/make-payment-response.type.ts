export type InsuranceMakePaymentSuccessResponse = {
  success: true;
  data: string;
};

export type InsuranceMakePaymentErrorResponse = {
  success: false;
  data: {
    errorCode: string;
    errorMessage: string;
  };
};

export type InsuranceMakePaymentResultResponse =
  | InsuranceMakePaymentSuccessResponse
  | InsuranceMakePaymentErrorResponse;
