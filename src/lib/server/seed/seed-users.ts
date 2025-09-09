import { USERS_SEED_STRING } from '$env/static/private';
import { createUser } from '$lib/server/auth';

const newUsers = JSON.parse(USERS_SEED_STRING);

export function seedUsers() {
  console.warn('Starting Users seed..');
  console.time('user seed');

  newUsers.forEach(async (usr: any) => {
    console.info('Seeding:', usr.username);

    const u = await createUser(usr);

    if (u.success) {
      console.info('Successfully added', usr.username);
    } else {
      console.error('Failed adding', usr.username, 'with error:\n', u.error);
    }
  });

  console.timeEnd('user seed');
  console.info('Done Seeding Users');
}
