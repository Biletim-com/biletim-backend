import { assertString } from '../utils';

export const isValidLuhn = (str: string): boolean => {
  assertString(str);
  const sanitized = str.replace(/[- ]+/g, '');
  let sum = 0;
  let tmpNum: number;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    const digit = sanitized.charAt(i);
    tmpNum = parseInt(digit, 10);

    if (shouldDouble) {
      tmpNum *= 2;
      sum += tmpNum >= 10 ? (tmpNum % 10) + 1 : tmpNum;
    } else {
      sum += tmpNum;
    }

    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};
