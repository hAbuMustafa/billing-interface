import dayjs from 'dayjs';

export function formatDate(dateSerial: number, format = 'YYYY-MM-DD') {
  return dayjs(dateSerial).format(format);
}
