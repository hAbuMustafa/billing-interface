import dayjs from 'dayjs';

export function formatDate(dateSerial: number, format = 'YYYY-MM-DD') {
  return dayjs(dateSerial).format(format);
}

export function convertGoogleSheetsDateToJSDate(serial: number) {
  return (serial - 25569) * 24 * 60 * 60 * 1000;
}
