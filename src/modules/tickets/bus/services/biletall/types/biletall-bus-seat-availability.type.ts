import { ActionResult, SoapEnvelope } from '@app/common/types';

type BusSeatAvailabilityResponseDataSet = {
  IslemSonuc: ActionResult[];
};

export type BusSeatAvailabilityResponse =
  SoapEnvelope<BusSeatAvailabilityResponseDataSet>;
