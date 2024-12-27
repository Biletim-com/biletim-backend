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
  private static biletimFeePercentage: number = 10;

  /**
   * Generates a detailed breakdown of the ticket price, including
   * net price, tax, provider service fee, and added Biletim fee.
   *
   * @param net         The net price of the ticket
   * @param tax         The tax amount
   * @param providerFee The service fee from the provider
   * @returns An object containing all cost components normalized to 2 decimals
   */
  public static calculateBreakdown(
    net: number | string,
    tax: number | string,
    providerFee: number | string,
  ) {
    const netPriceNumber = Number(normalizeDecimal(net));
    const taxNumber = Number(normalizeDecimal(tax));
    const providerFeeNumber = Number(normalizeDecimal(providerFee));

    const baseTotalNumber = netPriceNumber + taxNumber + providerFeeNumber;
    // apply biletim fee
    const addedFeeNumber = baseTotalNumber * (this.biletimFeePercentage / 100);
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
   * @param providerServiceFee  The provider’s service fee
   * @returns The final total price as a number, rounded to 2 decimals
   */
  public static getTotalPriceWithFee(
    ticketNetPrice: number | string,
    tax: number | string,
    providerServiceFee: number | string,
  ): number {
    const { finalTotal } = this.calculateBreakdown(
      ticketNetPrice,
      tax,
      providerServiceFee,
    );
    return parseFloat(normalizeDecimal(finalTotal));
  }

  /**
   * Computes the total service fee, combining both the provider’s fee
   * and the Biletim fee. This effectively is:
   *
   *   providerFee + (BiletimFee% of (netPrice + tax + providerFee))
   *
   * @param ticketNetPrice      The net ticket price
   * @param tax                 The tax amount
   * @param providerServiceFee  The provider’s service fee
   * @returns The combined service fee (provider + Biletim) as a number
   */
  public static getTotalServiceFee(
    ticketNetPrice: number | string,
    tax: number | string,
    providerServiceFee: number | string,
  ): number {
    const { providerFee, addedFee } = this.calculateBreakdown(
      ticketNetPrice,
      tax,
      providerServiceFee,
    );
    const combinedFee = providerFee + addedFee;
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
   * @param totalPrice The full price (net + tax + providerFee + Biletim fee)
   * @returns The Biletim fee portion, as a number
   */
  public static getAddedFee(totalPrice: number | string): number {
    const totalPriceNumber = Number(normalizeDecimal(totalPrice));

    const addedFee =
      (totalPriceNumber * this.biletimFeePercentage) /
      (100 + this.biletimFeePercentage);

    return parseFloat(normalizeDecimal(addedFee));
  }

  /**
   * From a final total (which includes net, tax, providerFee, and Biletim fee),
   * extracts the portion that belongs to the provider (i.e., net + tax + providerFee).
   *
   *   providerSubtotal = totalPrice - BiletimFee
   *
   * @param totalPrice The full price (net + tax + providerFee + Biletim fee)
   * @returns The subtotal that belongs to the provider, as a number
   */
  public static getProviderSubtotal(totalPrice: number | string): number {
    const totalPriceNumber = Number(normalizeDecimal(totalPrice));
    const biletimFeePortion = this.getAddedFee(totalPriceNumber);

    const providerSubtotal = totalPriceNumber - biletimFeePortion;
    return parseFloat(normalizeDecimal(providerSubtotal));
  }

  /**
   * Determines the provider’s original service fee from the final
   * combined service fee. For instance:
   *
   *   totalServiceFee = providerFee + BiletimFee
   *
   * So if `totalPrice` includes everything (net + tax + providerFee + BiletimFee),
   * and `totalServiceFee` = providerFee + BiletimFee,
   * we subtract out the Biletim fee portion to get the original provider fee.
   *
   * @param totalPrice       The full price (net + tax + providerFee + Biletim fee)
   * @param totalServiceFee  The combined service fee (provider + Biletim)
   * @returns The provider’s fee portion, as a number
   */
  public static getProviderOriginalFee(
    totalPrice: number | string,
    totalServiceFee: number | string,
  ): number {
    const totalPriceNumber = Number(normalizeDecimal(totalPrice));
    const totalServiceFeeNumber = Number(normalizeDecimal(totalServiceFee));

    const biletimFeePortion = this.getAddedFee(totalPriceNumber);
    const providerFeeOnly = totalServiceFeeNumber - biletimFeePortion;

    return parseFloat(normalizeDecimal(providerFeeOnly));
  }
}
