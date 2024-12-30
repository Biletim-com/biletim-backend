type HotelResponse<T, D, S> = {
  data: T;
  debug: Record<string, unknown>;
  error: D;
  status: S;
};

type Errors =
  | 'decoding_json'
  | 'invalid_params'
  | 'not_allowed_host'
  | 'unexpected_method'
  | 'overdue_debt'
  | 'no_auth_header'
  | 'invalid_auth_header'
  | 'endpoint_not_found'
  | 'incorrect_credentials'
  | 'not_allowed'
  | 'endpoint_not_active'
  | 'endpoint_exceeded_limit'
  | 'lock'
  | 'hotel_not_found'
  | 'unknown'
  | 'server_error';

export type HotelErrorResponse = HotelResponse<null, Errors, 'error'>;

export type HotelSuccessfulResponse<T> = HotelResponse<T, null, 'ok'>;
