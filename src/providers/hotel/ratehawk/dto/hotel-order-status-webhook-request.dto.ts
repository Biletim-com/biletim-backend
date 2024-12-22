export class HotelOrderStatusWebhookRequestDto {
  data: {
    partner_order_id: string;
    status: 'completed' | 'rejected';
  };
  signature: {
    signature: string;
    timestamp: number;
    token: string;
  };
}
