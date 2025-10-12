import { getGravatarHash } from '$lib/utils/gravatar';
import bcrypt from 'bcryptjs';
import { db } from '$lib/server/db';
import { Sys_Users, Sys_Sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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
