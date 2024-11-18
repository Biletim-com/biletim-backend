export const isValidTCNumber = (tcNumber: string): boolean => {
  if (tcNumber.length !== 11) {
    return false;
  }

  for (let i = 0; i < 11; i++) {
    if (!/^\d$/.test(tcNumber[i])) {
      return false;
    }
  }

  if (tcNumber[0] === '0') {
    return false;
  }

  const tcNumberArray = tcNumber.split('').map(Number);
  const sumFirstTenDigits = tcNumberArray
    .slice(0, 10)
    .reduce((acc, val) => acc + val, 0);
  const controlDigit = sumFirstTenDigits % 10;

  if (controlDigit !== tcNumberArray[10]) {
    return false;
  }

  return true;
};
