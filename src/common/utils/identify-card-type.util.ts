import { BankCardType } from '../enums';

export const identifyCardType = (cardNumber: string): BankCardType => {
  const cardIIN = cardNumber.slice(0, 6);

  // visa => starts with 4
  if (/^4\d{5}/.test(cardIIN)) {
    return BankCardType.VISA;
  }

  // masterCard => starts with 51-55 || 2221-2720
  if (/^(5[1-5]|22[2-9]|2[3-6]\d|27[01])/.test(cardIIN)) {
    return BankCardType.TROY;
  }

  // troy starts with 9792
  if (/^9792/.test(cardIIN)) {
    return BankCardType.TROY;
  }

  throw new Error('');
};
