export const usernamePattern = /^[\w\-]{4,16}$/;
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
export const arabicTriadicNamesPattern = /^([ء-ي]+ ){2,}[ء-ي]+$/;
export const arabicNamePattern = /^[ء-ي]+( [ء-ي]+)?$/;
export const egyptianMobileNumberPattern = /^01[0125]\d{8}$/;
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const nationalIdPattern =
  /[23]\d\d((0[1-9])|(1[0-2]))((0[1-9])|([1-2]\d)|(3[0-1]))((0[1-4])|(1[1-9])|(2[1-9])|(3[1-5])|(88))\d{5}/;
