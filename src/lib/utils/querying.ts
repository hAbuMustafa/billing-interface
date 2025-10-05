import { getRegexString } from 'extend-arabic-query';

export function regexifiedPersonName(personName: string) {
  return new RegExp(
    getRegexString(personName)
      .replaceAll('?:', '')
      .replaceAll(' ', '.*')
      .replaceAll('؟', '.')
  );
}
