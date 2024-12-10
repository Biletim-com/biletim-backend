import { BankCardType } from '../enums';

export const cardTypePatterns: Record<
  BankCardType,
  { full: RegExp; iin: RegExp }
> = {
  [BankCardType.AMEX]: {
    full: /^3[47][0-9]{13}$/,
    iin: /^3[47]/,
  },
  [BankCardType.DINERSCLUB]: {
    full: /^3(?:0[0-5]|[68])[0-9]{11}$/,
    iin: /^3(?:0[0-5]|[68])/,
  },
  [BankCardType.DISCOVER]: {
    full: /^6(?:011|5[0-9][0-9])[0-9]{12,15}$/,
    iin: /^6(?:011|5)/,
  },
  [BankCardType.JCB]: {
    full: /^(?:2131|1800|35\d{3})\d{11}$/,
    iin: /^35/,
  },
  [BankCardType.MASTERCARD]: {
    full: /^(?:5[1-5][0-9]{2}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720))[0-9]{12}$/,
    iin: /^(5[1-5]|22[2-9]|2[3-6]|27[01]|2720)/,
  },
  [BankCardType.UNIONPAY]: {
    full: /^(6[27][0-9]{14}|^(81[0-9]{14,17}))$/,
    iin: /^(62|81)/,
  },
  [BankCardType.VISA]: {
    full: /^(?:4[0-9]{12})(?:[0-9]{3,6})?$/,
    iin: /^4/,
  },
  [BankCardType.TROY]: {
    full: /^9792[0-9]{12}$/,
    iin: /^9792/,
  },
};
