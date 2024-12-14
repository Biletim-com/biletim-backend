import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { RatehawkRequestService } from './ratehawk-request.service';

import { HotelOrderCancelRequestDto } from '../dto/hotel-order-cancel.dto';
import { CaseConversionService } from '@app/common/helpers';

@Injectable()
export class RatehawkOrderCancelService {
  private readonly caseConversionService = CaseConversionService;
  constructor(
    private readonly ratehawkRequestService: RatehawkRequestService,
  ) {}

  async orderCancellation(
    partner_order_id: HotelOrderCancelRequestDto,
  ): Promise<any> {
    return this.ratehawkRequestService.sendRequest<any>({
      path: '/hotel/order/cancel/',
      method: 'POST',
      data: { partner_order_id },
    });
  }

  async downloadInfoInvoice(partner_order_id: string): Promise<Buffer> {
    const params = { partner_order_id };
    const jsonData = encodeURIComponent(JSON.stringify(params));
    const url = `https://api.worldota.net/api/b2b/v3/hotel/order/document/info_invoice/download/?data=${jsonData}`;

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    return this.caseConversionService.convertKeysToCamelCase(response.data);
  }
}
