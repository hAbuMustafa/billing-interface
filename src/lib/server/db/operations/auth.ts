import { getGravatarHash } from '$lib/utils/gravatar';
import bcrypt from 'bcryptjs';
import { db } from '$lib/server/db';
import { Users, Sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function validateLogin(username: string, password: string) {
  const [user] = await db.select().from(Users).where(eq(Users.username, username));

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

export async function createSession(
  userId: number,
  sessionId: string,
  sessionMaxAge: Date
) {
  try {
    const newSession = await db.transaction(async (tx) => {
      const [sessionInsert] = await tx
        .insert(Sessions)
        .values({
          id: sessionId,
          user_id: userId,
          expires_at: sessionMaxAge,
        })
        .returning();

      const [updatedUser] = await tx
        .update(Users)
        .set({ last_login: new Date() })
        .returning();

      return sessionInsert;
    });

    return {
      success: true,
      data: newSession,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function getUserFromSession(sessionId: string) {
  const sessionsData = await db
    .select()
    .from(Sessions)
    .innerJoin(Users, eq(Sessions.user_id, Users.id))
    .where(eq(Sessions.id, sessionId));
  if (sessionsData.length === 0) return null;

  if (sessionsData[0].Sys_Sessions.expires_at < new Date()) {
    try {
      await db.delete(Sessions).where(eq(Sessions.id, sessionId));
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
