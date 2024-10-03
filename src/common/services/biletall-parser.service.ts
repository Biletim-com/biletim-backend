import { Injectable } from '@nestjs/common';

import { BiletAllResponseError } from '../errors';
import { ActionResult, ErrorResponse, SoapEnvelope } from '../types';

@Injectable()
export class BiletAllParserService {
  public isErrorResponse(response: any): response is ErrorResponse {
    return (
      Array.isArray(response?.IslemSonuc) &&
      response.IslemSonuc.some((islemSonuc: ActionResult) =>
        Array.isArray(islemSonuc.Hata),
      )
    );
  }

  public extractResult<T>(response: SoapEnvelope<T>): T {
    const envelope = response['soap:Envelope'];
    const body = envelope['soap:Body'][0];
    const xmlIsletResponse = body['XmlIsletResponse'][0];
    const result = xmlIsletResponse['XmlIsletResult'][0];

    if (this.isErrorResponse(result)) {
      const errorMessage =
        result.IslemSonuc[0]?.Hata?.[0] ||
        'Something went wrong with the Soap client';
      throw new BiletAllResponseError(errorMessage);
    }

    return result;
  }
}
