export const normalizeDecimal = (
  value: number | string,
  precision = 2,
): string => {
  const numValue = Number(value).toFixed(precision);

  if (numValue === 'NaN') {
    throw new Error(
      'Invalid input: value must be a number or a string representing a number',
    );
  }
  return numValue;
};
