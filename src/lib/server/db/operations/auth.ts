import { getGravatarHash } from '$lib/utils/gravatar';
import bcrypt from 'bcryptjs';
import { db } from '$lib/server/db';
import { Sys_Users, Sys_Sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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

  try {
    const response = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(Sys_Users)
        .values({
          hashed_pw: passwordHash,
          active: false,
          role: 2, // todo: change this when roles are defined
          ...newUserData,
        })
        .returning();

      return user;
    });

    const { hashed_pw: droppedPwHash2, ...otherUserData } = response;

    return {
      success: true,
      user: otherUserData,
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
