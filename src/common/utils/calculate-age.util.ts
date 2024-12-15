export const calculateAge = (birthday: string): number => {
  const millisecondsDifference =
    new Date().getTime() - new Date(birthday).getTime();
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;

  return millisecondsDifference / millisecondsInYear;
};
