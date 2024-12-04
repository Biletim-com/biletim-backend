import { SendOrderCancelInitSMSDto } from '@app/common/dtos';

export type OrderEventsMap = {
  'order.cancel.init': SendOrderCancelInitSMSDto;
};
