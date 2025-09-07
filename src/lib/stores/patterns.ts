export const usernamePattern = /^[\w\-]{5,16}$/;
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const arabicTetradicNamesPattern = /^([ء-ي]+ ){2,}[ء-ي]+$/;
export const arabicNamePattern = /^[ء-ي]+( [ء-ي]+)?$/;
export const egyptianMobileNumberPattern = /^01[0125]\d{8}$/;
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
