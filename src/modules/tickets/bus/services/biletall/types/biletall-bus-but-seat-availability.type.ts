import { SoapEnvelope } from './biletall-bus-soap-envelope.type';
import { ActionResult } from './biletall-bus-action-result.type';

type BusSeatAvailabilityResponseDataSet = {
  IslemSonuc: ActionResult[];
};

export type BusSeatAvailabilityResponse =
  SoapEnvelope<BusSeatAvailabilityResponseDataSet>;
