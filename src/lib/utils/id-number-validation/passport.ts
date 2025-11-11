/**
 * @fileoverview contains utility functions to handle passport number processing. Based on step by step implementation from @external {@link https://en.wikipedia.org/wiki/Machine-readable_passport#Checksum_calculation|MRP Checksum Calculation}
 * @author Hosam Hamdy
 * @version 0.2
 */

/**
 * Provides the checksum calculations for a segment of the machine-readable passport booklet number
 * @param num - The segment you want to check the sum of against {@link checksum}.
 * @param [checksum=undefined] - The checksum digit that {@link num} should evaluate to.
 * @returns The result of the check as either `true` or `false`
 * */
export function verifyChecksum(num: number | string, checksum?: number) {
  if (typeof num === 'number') num = String(num);
  if (!/(\d|[A-Z]< ){2,}/.test(num) || num.length < 2) {
    console.error(
      'Wrong number format. Only alphanumeric digits, and the filler character "<" (or a space) are allowed.'
    );
    return false;
  }

  const numList = num.toUpperCase().split('');

  const numValue = numList.map((n) => {
    if (/^[0-9]$/.test(n)) return Number(n);
    if (/^[< ]$/.test(n)) return 0;
    if (/^[A-Z]$/.test(n)) return n.charCodeAt(0) - 55;
  });

  if (!checksum) {
    checksum = numValue.pop();

    if (typeof checksum !== 'number') {
      console.error(
        'Wrong arguments specified. Please either provide the checksum digit as an argument, or append it at the end of the first argument.'
      );
      return false;
    }
  }

  let sum = 0;

  const weights = [7, 3, 1];

  for (let i = 0; i < numValue.length; i++) {
    sum += numValue.at(i)! * weights[i % weights.length];
  }

  return sum % 10 === checksum;
}
