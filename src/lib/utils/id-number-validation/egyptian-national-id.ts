/**
 * @fileoverview contains utility functions to handle egyptian national id number processing.
 * @author Hosam Hamdy
 * @version 0.1
 */

import { nationalIdPattern } from '$lib/stores/patterns';

/**
 * Provides the checksum calculations for a segment of the machine-readable Egyptian national id number
 * @param num - The segment you want to check its check-digit (its last number).
 * @returns The result of the check as either `true` or `false`
 * */
export function verifyEgyptianNationalId(num: number | string) {
  if (typeof num === 'number') num = String(num);

  if (!nationalIdPattern.test(num)) {
    console.error(`Wrong Egyptian national ID format ${num}.`);
    return false;
  }

  const numList = num.split('').map((n) => Number(n));

  const checksum = numList.pop();

  let sum = 0;

  numList.reverse();

  const weights = [2, 3, 4, 5, 6, 7];

  for (let i = 0; i < numList.length; i++) {
    sum += numList.at(i)! * weights[i % weights.length];
  }

  const modulus = (11 - (sum % 11)) % 11;

  return (modulus === 0 ? 1 : modulus) === checksum;
}
