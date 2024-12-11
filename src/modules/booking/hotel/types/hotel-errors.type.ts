export type HotelErrorsResponse = {
  data: null;
  debug: Record<string, unknown>;
  error:
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
  status: 'error';
};
