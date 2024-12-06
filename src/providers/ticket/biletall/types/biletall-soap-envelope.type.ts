import { ErrorResponse } from './biletall-error.type';

export type SoapEnvelope<T> = {
  'soap:Envelope': {
    'soap:Body': Array<{
      XmlIsletResponse: Array<{
        XmlIsletResult: Array<T | ErrorResponse>;
      }>;
    }>;
  };
};
