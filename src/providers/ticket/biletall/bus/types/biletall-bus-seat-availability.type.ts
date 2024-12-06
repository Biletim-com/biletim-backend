import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';
import { ActionResult } from '../../types/biletall-action-result.type';

type BusSeatAvailabilityResponseDataSet = {
  IslemSonuc: ActionResult[];
};

export type BusSeatAvailabilityResponse =
  SoapEnvelope<BusSeatAvailabilityResponseDataSet>;
