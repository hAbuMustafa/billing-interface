import dayjs from 'dayjs';

export function formatDate(date: number | Date, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format);
}

export function convertGoogleSheetsDateToJSDate(serial: number) {
  const sheetsEpoch = new Date(1899, 11, 30); // December 30, 1899
  const jsDate = new Date(sheetsEpoch.getTime() + serial * 24 * 60 * 60 * 1000);

  return jsDate;
}

export function getAge(birthdate: number | Date | string) {
  let dateSerial =
    typeof birthdate === 'number' ? birthdate : new Date(birthdate).getTime();

  if (isNaN(dateSerial)) return 0;

  const msInADay = 60 * 60 * 24 * 1000;

  return Math.floor((new Date().getTime() - dateSerial) / (msInADay * 365.25));
}
