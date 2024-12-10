import { cardTypePatterns } from '../constants';
import { BankCardType } from '../enums';

/**
 * Identifies the card type based on the first 6 characters (IIN) of the card number.
 * @param cardNumber - The card number as a string.
 * @returns The corresponding BankCardType.
 * @throws An error if the card type cannot be determined.
 */
export const identifyBankCardType = (cardNumber: string): BankCardType => {
  if (cardNumber.length < 6) {
    throw new Error('card number must be at least 6 characters long');
  }

  const cardIIN = cardNumber.slice(0, 6);
  for (const [type, pattern] of Object.entries(cardTypePatterns)) {
    if (pattern.iin.test(cardIIN)) {
      return type as BankCardType;
    }
  }

  throw new Error('Unrecognized card type.');
};
