import { fail } from '@sveltejs/kit';

export function failWithFormFieldsAndMessageBuilder<
  T extends Record<string, string | number | boolean | Date | FormDataEntryValue | null>
>(fields: T) {
  return (failMessage: string) =>
    fail(401, {
      message: failMessage,
      ...fields,
    });
}
