import { cardTypePatterns } from '../constants';
import { BankCardType } from '../enums';
import { assertString } from '../utils/assert-string.util';
import { isValidLuhn } from './in-valid-luhn.validator';

// source: https://github.com/validatorjs/validator.js/blob/master/src/lib/isCreditCard.js

const allCards: RegExp[] = Object.values(cardTypePatterns).map(
  (pattern) => pattern.full,
);

export const isBankCardNumber = (
  card: string,
  options: { provider?: BankCardType } = {},
): boolean => {
  assertString(card);
  const { provider } = options;
  const sanitized = card.replace(/[- ]+/g, '');

  if (provider) {
    const normalizedProvider = provider.toLowerCase();
    if (cardTypePatterns.hasOwnProperty(normalizedProvider)) {
      // specific provider in the list
      if (!cardTypePatterns[normalizedProvider].test(sanitized)) {
        return false;
      }
    } else {
      // specific provider not in the list
      throw new Error(`${provider} is not a valid credit card provider.`);
    }
  } else if (!allCards.some((cardRegex) => cardRegex.test(sanitized))) {
    // no specific provider
    return false;
  }

  return isValidLuhn(sanitized);
};
