import { ErrorResponse } from './biletall-bus-error.type';

export type SoapEnvelope<T> = {
  'soap:Envelope': {
    'soap:Body': Array<{
      XmlIsletResponse: Array<{
        XmlIsletResult: Array<T | ErrorResponse>;
      }>;
    }>;
  };
};
