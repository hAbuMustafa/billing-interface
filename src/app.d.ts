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
        email: string | null;
        national_id: string | null;
        role: number;
        created_at: Date;
        active: boolean;
        last_login: Date | null;
        gravatar: string;
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
