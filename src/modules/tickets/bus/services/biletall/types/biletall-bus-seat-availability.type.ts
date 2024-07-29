import { SoapEnvelope } from './biletall-soap-envelope.type';
import { ActionResult } from './biletall-action-result.type';

type BusSeatAvailabilityResponseDataSet = {
  IslemSonuc: ActionResult[];
};

export type BusSeatAvailabilityResponse =
  SoapEnvelope<BusSeatAvailabilityResponseDataSet>;
