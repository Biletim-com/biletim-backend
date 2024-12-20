import { DateTimeHelper } from '@app/common/helpers';

// entites
import { PlaneTicketSegment } from '@app/modules/orders/plane-ticket/entities/plane-ticket-segment.entity';
import { PlaneTicket } from '@app/modules/orders/plane-ticket/entities/plane-ticket.entity';

export class PlaneTicketOutputHandlerHelper {
  static mapPassengers(planeTickets: PlaneTicket[], pnrNumber: string) {
    return planeTickets.map(({ ticketNumber, passenger }) => ({
      passengerFullName: `${passenger.firstName} ${passenger.lastName}`,
      tcNumber: passenger.tcNumber as string,
      pnrNumber: pnrNumber as string,
      ticketNumber: ticketNumber as string,
    }));
  }

  static mapSegments(
    segments: PlaneTicketSegment[],
    pnrNumber: string,
    isReturnFlight: boolean,
  ) {
    return segments
      .filter((segment) => segment.isReturnFlight === isReturnFlight)
      .map((segment) => ({
        airlineCompany: segment.airlineName,
        departureAirportCode: segment.departureAirport.airportCode,
        departureAirportName: segment.departureAirport.airportNameEn,
        departureAirportCity: segment.departureAirport.cityNameEn,
        arrivalAirportCode: segment.arrivalAirport.airportCode,
        arrivalAirportName: segment.arrivalAirport.airportNameEn,
        arrivalAirportCity: segment.arrivalAirport.cityNameEn,
        flightNumber: segment.flightNumber,
        flightClass: segment.flightClassCode,
        flightClassType: segment.flightFareDetails.flightClassType,
        flightClassName: segment.flightFareDetails.flightClassName,
        luggageAllowance: segment.flightFareDetails.luggage,
        cabinLuggageAllowance: segment.flightFareDetails.cabinLuggage,
        luggageAllowanceDetails: 'Ekstra bagaj ücreti uygulanabilir.',
        departureDate: DateTimeHelper.formatTurkishDate(
          segment.departureDateTime,
        ),
        departureTime: DateTimeHelper.extractTime(segment.departureDateTime),
        arrivalDate: DateTimeHelper.formatTurkishDate(segment.arrivalDateTime),
        arrivalTime: DateTimeHelper.extractTime(segment.arrivalDateTime),
        flightDuration: DateTimeHelper.calculateDuration(
          segment.departureDateTime,
          segment.arrivalDateTime,
        ),
        pnrNumber,
      }));
  }
}
