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

export function failWithFormFieldsAndMessageArrayBuilder<
  T extends Record<string, InputTypes | InputTypes[] | null>
>(fields: T) {
  return (failMessages: string[] | ToastT[]) =>
    fail(401, {
      messages: failMessages,
      ...fields,
    });
}
