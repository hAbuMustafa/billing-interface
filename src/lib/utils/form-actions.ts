import { fail } from '@sveltejs/kit';

type InputTypes = string | number | boolean | Date | FormDataEntryValue;

export function failWithFormFieldsAndMessageBuilder<
  T extends Record<string, InputTypes | InputTypes[] | null>
>(fields: T) {
  return (failMessage: string) =>
    fail(401, {
      message: failMessage,
      ...fields,
    });
}
