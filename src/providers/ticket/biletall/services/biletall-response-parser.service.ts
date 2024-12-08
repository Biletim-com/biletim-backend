import { Injectable } from '@nestjs/common';

import { BiletAllResponseError } from '../errors/biletall-response.error';
import { ActionResult } from '../types/biletall-action-result.type';
import { SoapEnvelope } from '../types/biletall-soap-envelope.type';
import { ErrorResponse } from '../types/biletall-error.type';

@Injectable()
export class BiletAllParserService {
  protected isErrorResponse(response: any): response is ErrorResponse {
    return (
      Array.isArray(response?.IslemSonuc) &&
      response.IslemSonuc.some((islemSonuc: ActionResult) =>
        Array.isArray(islemSonuc.Hata),
      )
    );
  }

  protected extractResult<T>(response: SoapEnvelope<T>): T {
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
