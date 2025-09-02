export const getDateRangesForComparison = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endCurrentPeriod = new Date(today);
  endCurrentPeriod.setDate(today.getDate() - 1);
  endCurrentPeriod.setHours(23, 59, 59, 999);

  const startCurrentPeriod = new Date(endCurrentPeriod);
  startCurrentPeriod.setDate(endCurrentPeriod.getDate() - 6);
  startCurrentPeriod.setHours(0, 0, 0, 0);

  // -----
  const endPreviousPeriod = new Date(startCurrentPeriod);
  endPreviousPeriod.setDate(startCurrentPeriod.getDate() - 1);
  endPreviousPeriod.setHours(23, 59, 59, 999);

  const startPreviousPeriod = new Date(endPreviousPeriod);
  startPreviousPeriod.setDate(endPreviousPeriod.getDate() - 6);
  startPreviousPeriod.setHours(0, 0, 0, 0);

  return {
    current: { startDate: startCurrentPeriod, endDate: endCurrentPeriod },
    previous: { startDate: startPreviousPeriod, endDate: endPreviousPeriod },
  };
};

export const isDateWithinRange = (
  dateToCheck: Date | string,
  startDate: Date,
  endDate: Date
): boolean => {
  const d = new Date(dateToCheck);
  return d >= startDate && d <= endDate;
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "Not provided";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
