import { Enrollment3DsEligiableResponseDetails } from './enrollment-response.type';

type ThreeDSecureEligibility = {
  isEligibile: true;
  details: Enrollment3DsEligiableResponseDetails;
  requestId: string;
};

type ThreeDSecureIneligibility = {
  isEligibile: false;
  errorResponseCode: string;
  requestId: string;
};

export type ThreeDSecureEligibilityResponse =
  | ThreeDSecureEligibility
  | ThreeDSecureIneligibility;
