import dayjs from 'dayjs';

/**
 * Convert an Excel serial date to a formatted date string.
 */
export function dateFromExcelSerial(serial: number): string | number {
  // 1. Convert Excel serial to JS Date
  const utcDays = serial - 25569; // 25569 = days from 1900 to 1970
  const utcMs = utcDays * 86400000; // ms per day
  return utcMs;
}

export function dateToExcelSerial(dateString: string): number {
  const utcDays = new Date(dateString).getTime() / 86400000; // get the number of days since 1/1/1970 by dividing the number by daily milliseconds
  return utcDays + 25569; // base the date on 1900 instead of epoch's 1970
}

export function formatDate(dateSerial: number, format = 'YYYY/MM/DD') {
  return dayjs(dateSerial).format(format);
}
