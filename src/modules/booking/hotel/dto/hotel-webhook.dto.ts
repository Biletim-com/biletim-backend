export class WebhookRequestDto {
  data: {
    partner_order_id: string;
    status: string;
  };
  signature: {
    signature: string;
    timestamp: number;
    token: string;
  };
}
