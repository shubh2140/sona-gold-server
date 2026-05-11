/**
 * function to get current month
 *
 * @param currentDate The current Date
 * @returns start, and end Date in an object
 */
export function getCurrentMonth(currentDate: Date): {
  startDate: Date;
  endDate: Date;
} {
  const currentMonth = currentDate.getUTCMonth();
  const currentYear = currentDate.getUTCFullYear();

  const startDate = new Date(Date.UTC(currentYear, currentMonth, 1));
  const endDate = new Date(Date.UTC(currentYear, currentMonth + 1, 0));

  return { startDate: startDate, endDate: endDate };
}
