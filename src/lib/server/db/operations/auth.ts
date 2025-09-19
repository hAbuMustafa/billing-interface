import { getGravatarHash } from '$lib/utils/gravatar';
import bcrypt from 'bcryptjs';
import { db } from '$lib/server/db';
import {
  Sys_Users,
  Sys_Sessions,
  Sys_Sec_pb_key,
  Sys_Sec_pv_key,
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateKeyPairSync } from 'node:crypto';
import { PV_KEY_ENCR_KEY } from '$env/static/private';

const SALT_ROUNDS = 12;

type NewUserDataT = {
  username: string;
  password: string;
  name: string;
  national_id: string;
  email: string;
  phone_number: string;
};

export async function createUser(newUserData: NewUserDataT) {
  const passwordHash = await bcrypt.hash(newUserData.password, SALT_ROUNDS);

  const { publicKey: encryptedPbKey, privateKey: encryptedPvKey } = generateKeyPairSync(
    'rsa',
    {
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
    }
  );

  try {
    const response = await db.transaction(async (tx) => {
      const [new_pb_key] = await tx
        .insert(Sys_Sec_pb_key)
        .values({ key: encryptedPbKey })
        .returning();

      const [new_pv_key] = await tx
        .insert(Sys_Sec_pv_key)
        .values({ key: encryptedPvKey })
        .returning();

      const [user] = await tx
        .insert(Sys_Users)
        .values({
          hashed_pw: passwordHash,
          active: false,
          role: 2, // todo: change this when roles are defined
          pb_key_id: new_pb_key.id,
          pv_key_id: new_pv_key.id,
          ...newUserData,
        })
        .returning();

      return user;
    });

    const { hashed_pw: droppedPwHash2, ...otherUserData } = response;

    return {
      success: true,
      data: otherUserData,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function validateLogin(username: string, password: string) {
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

  const { hashed_pw: droppedPwHash, ...otherUserData } = user;

  return otherUserData;
}

export async function getUserFromSession(sessionId: string) {
  const sessionsData = await db
    .select()
    .from(Sys_Sessions)
    .innerJoin(Sys_Users, eq(Sys_Sessions.user_id, Sys_Users.id))
    .where(eq(Sys_Sessions.id, sessionId));
  if (sessionsData.length === 0) return null;

  if (sessionsData[0].Sys_Sessions.expires_at < new Date()) {
    try {
      await db.delete(Sys_Sessions).where(eq(Sys_Sessions.id, sessionId));
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  const { hashed_pw: droppedPwHash, ...user } = sessionsData[0].Sys_Users;

  const userObj = {
    ...user,
    gravatar: user.email
      ? `https://0.gravatar.com/avatar/${getGravatarHash(user.email)}`
      : '/default-profile.jpg',
  };

  return userObj;
}
