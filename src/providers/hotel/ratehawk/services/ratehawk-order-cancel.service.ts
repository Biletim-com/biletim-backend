import { Injectable } from '@nestjs/common';
import axios from 'axios';

// services
import { RatehawkRequestService } from './ratehawk-request.service';

// helpers
import { CaseConversionService } from '@app/common/helpers';

// dto
import { OrderReturnTotalPenaltyDto } from '@app/common/dtos';

// types
import { DeepConvertKeysToCamel } from '@app/common/types';
import { CancellationPenalties } from '../types/hotel-payment-type.type';
import { HotelOrderCancelResponseData } from '../types/hotel-order-cancel-response.type';

@Injectable()
export class RatehawkOrderCancelService {
  private readonly caseConversionService = CaseConversionService;
  constructor(
    private readonly ratehawkRequestService: RatehawkRequestService,
  ) {}

  async orderCancellation(reservationNumber: string) {
    return this.ratehawkRequestService.sendRequest<HotelOrderCancelResponseData>(
      {
        path: '/hotel/order/cancel/',
        method: 'POST',
        data: { partner_order_id: reservationNumber },
      },
    );
  }

  public orderReturnPenalty(
    cancellationPenalties: DeepConvertKeysToCamel<CancellationPenalties>,
    totalTicketPrice: string,
  ): OrderReturnTotalPenaltyDto {
    const totalTicketPriceFloat = parseFloat(totalTicketPrice);
    const currentDate = new Date();

    let totalPenaltyAmount = 0;
    let amountToRefund = totalTicketPriceFloat;

    for (const policy of cancellationPenalties.policies) {
      const startAt = policy.startAt ? new Date(policy.startAt) : null;
      const endAt = policy.endAt ? new Date(policy.endAt) : null;

      if (
        (!startAt || currentDate >= startAt) &&
        (!endAt || currentDate < endAt)
      ) {
        totalPenaltyAmount = parseFloat(policy.amountShow);
        amountToRefund = totalTicketPriceFloat - totalPenaltyAmount;
        break;
      }
    }
    return {
      totalTicketPrice: totalTicketPriceFloat.toFixed(2),
      providerPenaltyAmount: '0',
      companyPenaltyAmount: '0',
      totalPenaltyAmount: totalPenaltyAmount.toFixed(2),
      amountToRefund: amountToRefund.toFixed(2),
    };
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
