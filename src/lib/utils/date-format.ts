import dayjs from 'dayjs';

/**
 * Convert an Excel serial date to a formatted date string.
 */
export function dateFromSerial(serial: number, format = 'YYYY/MM/DD'): string {
  // 1. Convert Excel serial to JS Date
  const utcDays = Math.floor(serial - 25569); // 25569 = days from 1900 to 1970
  const utcMs = utcDays * 86400000; // ms per day
  return dayjs(utcMs).format(format);
}
