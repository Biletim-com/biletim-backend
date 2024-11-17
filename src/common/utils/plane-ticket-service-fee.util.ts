import { normalizeDecimal } from './normalize-decimal.util';

export class PlaneTicketServiceFee {
  private static biletimServiceFeePercentage = 10;

  static setServiceFee(
    ticketPrice: number | string,
    tax: number | string,
    providerServiceFee: number | string,
  ): string {
    const ticketPriceNumber = Number(normalizeDecimal(ticketPrice));
    const taxNumber = Number(normalizeDecimal(tax));
    const providerServiceFeeNumber = Number(
      normalizeDecimal(providerServiceFee),
    );
    const totalPrice = ticketPriceNumber + taxNumber + providerServiceFeeNumber;

    const totalServiceFee =
      (totalPrice * this.biletimServiceFeePercentage) / 100;

    return normalizeDecimal(totalServiceFee + providerServiceFeeNumber);
  }

  static revealAddedServiceFee(totalPrice: number | string): string {
    const totalPriceNumber = Number(normalizeDecimal(totalPrice));
    const addedServiceFee =
      (totalPriceNumber * this.biletimServiceFeePercentage) /
      (100 + this.biletimServiceFeePercentage);

    return normalizeDecimal(addedServiceFee);
  }

  static revealOriginalProviderServiceFee(
    totalPrice: number | string,
    totalServiceFee: number | string,
  ): string {
    const addedServiceFee = Number(this.revealAddedServiceFee(totalPrice));
    const originalServiceFee =
      Number(normalizeDecimal(totalServiceFee)) - addedServiceFee;
    return normalizeDecimal(originalServiceFee);
  }
}

// const ticketPrice = 79.33;
// const tax = 10.33;
// const providerServiceFee = 10.33;
// const originalTotalPrice = normalizeDecimal(
//   ticketPrice + tax + providerServiceFee,
// );

// const newServiceFee = PlaneTicketServiceFee.setServiceFee(
//   ticketPrice,
//   tax,
//   providerServiceFee,
// );
// const newTotalPrice = normalizeDecimal(
//   ticketPrice + tax + Number(newServiceFee),
// );
// console.log({ newServiceFee, originalTotalPrice, newTotalPrice });

// console.log(PlaneTicketServiceFee.revealAddedServiceFee(newTotalPrice));
// console.log(
//   PlaneTicketServiceFee.revealOriginalProviderServiceFee(
//     newTotalPrice,
//     newServiceFee,
//   ),
// );
