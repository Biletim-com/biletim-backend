import { normalizeDecimal } from './normalize-decimal.util';

/**
 * A static utility class for managing plane ticket fees and commissions (Biletim).
 *
 * Responsibilities:
 *  - Normalizing numeric values to 2 decimals using `normalizeDecimal`
 *  - Calculating totals, service fees, and individual portions
 *  - Providing helper methods to extract or recompute original amounts
 *    (e.g., removing the Biletim fee to get the provider’s subtotal)
 */
export class PlaneTicketFeeManager {
  /**
   * Biletim’s additional fee percentage, applied on top of the base
   * total (net price + tax + provider’s fee).
   */
  private static biletimFeePercentage: number = 0;

  /**
   * Generates a detailed breakdown of the ticket price, including
   * net price, tax, provider service fee (calculated as serviceFee + minServiceFee),
   * and added Biletim fee.
   *
   * @param net         The net price of the ticket
   * @param tax         The tax amount
   * @param providerFee The combined service fee from the provider (serviceFee + minServiceFee)
   * @returns An object containing all cost components normalized to 2 decimals
   */
  private static calculateBreakdown(
    net: number | string,
    tax: number | string,
    providerFee: number | string,
  ) {
    const netPriceNumber = Number(normalizeDecimal(net));
    const taxNumber = Number(normalizeDecimal(tax));
    const providerFeeNumber = Number(normalizeDecimal(providerFee));

    const baseTotalNumber = netPriceNumber + taxNumber + providerFeeNumber;
    // apply biletim fee
    const addedFeeNumber = (baseTotalNumber * this.biletimFeePercentage) / 100;
    const finalTotalNumber = baseTotalNumber + addedFeeNumber;

    return {
      netPrice: parseFloat(normalizeDecimal(netPriceNumber)),
      tax: parseFloat(normalizeDecimal(taxNumber)),
      providerFee: parseFloat(normalizeDecimal(providerFeeNumber)),
      baseTotal: parseFloat(normalizeDecimal(baseTotalNumber)),
      addedFee: parseFloat(normalizeDecimal(addedFeeNumber)),
      finalTotal: parseFloat(normalizeDecimal(finalTotalNumber)),
    };
  }

  /**
   * Computes the final price (net + tax + providerFee) plus
   * the Biletim service fee (i.e., biletimFeePercentage% on top).
   *
   * @param ticketNetPrice      The net ticket price
   * @param tax                 The tax amount
   * @param providerServiceFee  The combined service fee from the provider (serviceFee + minServiceFee)
   * @returns The final total price as a number, rounded to 2 decimals
   */
  public static getTotalPriceWithFee(
    ticketNetPrice: number | string,
    tax: number | string,
    providerFee: number | string,
  ): number {
    const { finalTotal } = this.calculateBreakdown(
      ticketNetPrice,
      tax,
      providerFee,
    );
    return parseFloat(normalizeDecimal(finalTotal));
  }

  /**
   * Computes the total service fee, combining both the provider’s fee
   * (serviceFee + minServiceFee) and the Biletim fee. This effectively is:
   *
   *   providerFee + (BiletimFee% of (netPrice + tax + providerFee))
   *
   * @param ticketNetPrice      The net ticket price
   * @param tax                 The tax amount
   * @param providerFee  The combined service fee from the provider (serviceFee + minServiceFee)
   * @returns The combined service fee (provider + Biletim) as a number
   */
  public static getTotalServiceFee(
    netPrice: number | string,
    tax: number | string,
    providerFee: number | string,
  ): number {
    const { providerFee: providerServiceFee, addedFee } =
      this.calculateBreakdown(netPrice, tax, providerFee);
    const combinedFee = providerServiceFee + addedFee;
    return parseFloat(normalizeDecimal(combinedFee));
  }

  /**
   * Extracts just the Biletim fee portion from a final total that
   * already includes (net + tax + providerFee + Biletim fee).
   *
   * It uses a ratio to “reverse out” the Biletim fee from the total:
   *
   *   BiletimFee = (totalPrice * biletimFeePercentage)
   *                / (100 + biletimFeePercentage)
   *
   * @param totalPrice The full price (net + tax + providerFee + minServiceFee+ Biletim fee)
   * @returns The Biletim fee portion, as a number
   */
  public static getAddedFee(totalPrice: number | string): number {
    const totalPriceNumber = Number(normalizeDecimal(totalPrice));
    const addedFee =
      (totalPriceNumber * this.biletimFeePercentage) /
      (100 + this.biletimFeePercentage);
    return parseFloat(normalizeDecimal(addedFee));
  }
}
