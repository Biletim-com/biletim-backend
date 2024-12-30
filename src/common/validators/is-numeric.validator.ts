export const isNumeric = (n: string) => {
  const num = parseFloat(n);
  return !isNaN(num) && isFinite(num);
};
