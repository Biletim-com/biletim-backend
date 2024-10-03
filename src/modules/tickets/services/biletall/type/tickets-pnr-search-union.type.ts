import { PnrSearchAbroadFlightResponse } from './tickets-pnr-search-abroad-flight-response.type';
import { PnrSearchBusResponse } from './tickets-pnr-search-bus-response.type';
import { PnrSearchDomesticFlightResponse } from './tickets-pnr-search-domestic-flight-response.type';

export type PnrSearchResponse =
  | PnrSearchBusResponse
  | PnrSearchDomesticFlightResponse
  | PnrSearchAbroadFlightResponse;
