import dayjs from 'dayjs';

export function formatDate(dateSerial: number, format = 'YYYY-MM-DD') {
  return dayjs(dateSerial).format(format);
}

export function convertGoogleSheetsDateToJSDate(serial: number) {
  const sheetsEpoch = new Date(1899, 11, 30); // December 30, 1899
  const jsDate = new Date(sheetsEpoch.getTime() + serial * 24 * 60 * 60 * 1000);

  return jsDate;
}
