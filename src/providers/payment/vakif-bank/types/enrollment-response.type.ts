export type Enrollment3DsEligiableResponseDetails = {
  PaReq: string;
  ACSUrl: string;
  TermUrl: string;
  MD: string;
};

type Enrollment3DsEligiableResponse = {
  IPaySecure: {
    Message: {
      VERes: {
        Version: string;
        Status: 'Y';
        ACTUALBRAND: string;
      } & Enrollment3DsEligiableResponseDetails;
      _ID: string;
    };
    VerifyEnrollmentRequestId: string;
    MessageErrorCode: string;
  };
};

type Enrollment3DsIneligiableResponse = {
  IPaySecure: {
    Message: {
      VERes: {
        Version: string;
        Status: 'E' | 'A' | 'N';
        ACTUALBRAND: string;
      };
      _ID: string;
    };
    VerifyEnrollmentRequestId: string;
    MessageErrorCode: string;
  };
};

export type EnrollmentResponse =
  | Enrollment3DsEligiableResponse
  | Enrollment3DsIneligiableResponse;
