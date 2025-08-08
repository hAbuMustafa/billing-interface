// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: {
        id: number;
        username: string;
        name: string;
        phone_number: string;
        password_hash: string;
      } | null;
    }
    // interface PageData {}
    interface PageState {
      DateColumnT: string | { name: string; format: string };
    }
    // interface Platform {}
  }
}

export {};
