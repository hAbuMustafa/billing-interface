// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: {
        id: number;
        username: string;
        role: number;
        person_id: bigint;
        staff_id: number | null;
        public_key: bigint;
        private_key: bigint;
        created_at: Date;
        active: number;
        last_login: Date | null;
        gravatar: string;
        contacts?: { [key: string]: string };
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
