import { generateKeyPairSync } from 'node:crypto';
import { PUBLIC_users_spreadsheetId } from '$env/static/public';
import { PV_KEY_ENCR_KEY } from '$env/static/private';
import { formatDate } from '$lib/utils/date-format';
import { getGravatarHash } from '$lib/utils/gravatar';
import bcrypt from 'bcryptjs';
import { db } from './db';
import {
  People,
  Sys_Users,
  S_pb_keys,
  S_pv_keys,
  People_contact_information,
  Sys_Sessions,
} from './schema';
import { and, eq, sql } from 'drizzle-orm';

const SALT_ROUNDS = 12;

type NewUserDataT = {
  first_name: string;
  father_name: string;
  grandfather_name: string;
  family_name: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
};

function dropPasswordHash(
  userObject: typeof Sys_Users.$inferSelect
): Omit<typeof Sys_Users.$inferSelect, 'hashed_pw'> {
  const { hashed_pw, ...otherFields } = userObject;
  return otherFields;
}

export async function createUser(newUserData: NewUserDataT) {
  const passwordHash = await bcrypt.hash(newUserData.password, SALT_ROUNDS);

  const { first_name, father_name, grandfather_name, family_name } = newUserData;

  try {
    const response = await db.transaction(async (tx) => {
      const { publicKey: encryptedPbKey, privateKey: encryptedPvKey } =
        generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: PV_KEY_ENCR_KEY,
          },
        });

      const [newPbKey] = await tx
        .insert(S_pb_keys)
        .values({
          key: encryptedPbKey,
        })
        .$returningId();

      const [newPvKey] = await tx
        .insert(S_pv_keys)
        .values({
          key: encryptedPvKey,
        })
        .$returningId();

      const [newPerson] = await tx
        .insert(People)
        .values({
          first_name,
          father_name,
          grandfather_name,
          family_name,
        })
        .$returningId();

      const [phoneNumberRow] = await tx
        .insert(People_contact_information)
        .values({
          contact_string: newUserData.phoneNumber,
          contact_type: 'phone-number',
          is_verified: 0,
          person_id: BigInt(newPerson.id),
        })
        .$returningId();

      const [emailRow] = await tx
        .insert(People_contact_information)
        .values({
          contact_string: newUserData.email,
          contact_type: 'email',
          is_verified: 0,
          person_id: BigInt(newPerson.id),
        })
        .$returningId();

      const [newUser] = await tx
        .insert(Sys_Users)
        .values({
          username: newUserData.username,
          hashed_pw: passwordHash,
          role: 2, // todo: change this when roles are defined
          person_id: BigInt(newPerson.id),
          public_key: BigInt(newPbKey.id),
          private_key: BigInt(newPvKey.id),
          active: 0,
        })
        .$returningId();

      const [user] = await tx
        .select()
        .from(Sys_Users)
        .where(eq(Sys_Users.id, newUser.id));

      return user;
    });

    return {
      success: true,
      user: dropPasswordHash(response),
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

export async function validateUser(username: string, password: string) {
  const [user] = await db
    .select()
    .from(Sys_Users)
    .where(eq(Sys_Users.username, username));

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.hashed_pw);

  if (!isValid) {
    return null;
  }

  const cleanedUser = dropPasswordHash(user);

  return cleanedUser;
}

export async function getUserFromSession(sessionId: string) {
  const sessionsData = await db
    .select()
    .from(Sys_Sessions)
    .innerJoin(Sys_Users, eq(Sys_Sessions.user_id, Sys_Users.id))
    .innerJoin(
      People_contact_information,
      eq(People_contact_information.person_id, Sys_Users.person_id)
    )
    .where(
      and(
        eq(Sys_Sessions.id, sessionId),
        eq(People_contact_information.contact_type, 'email')
      )
    );
  if (sessionsData.length === 0) return null;

  if (sessionsData[0].Sys_Sessions.expires_at < new Date()) {
    try {
      await db.delete(Sys_Sessions).where(eq(Sys_Sessions.id, sessionId));
    } catch (error) {
      console.error(error);
    }

    // todo: delete cookies
    return null;
  }

  const user = dropPasswordHash(sessionsData[0].Sys_Users);

  user.gravatar = sessionsData[0].People_contact_information.contact_string
    ? `https://0.gravatar.com/avatar/${getGravatarHash(
        sessionsData[0].People_contact_information.contact_string
      )}`
    : '/default-profile.jpg';

  return user;
}
