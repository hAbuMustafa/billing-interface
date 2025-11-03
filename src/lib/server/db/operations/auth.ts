import bcrypt from 'bcryptjs';
import { db } from '$lib/server/db';
import { RefreshTokens, Users } from '$lib/server/db/schema';
import { and, eq, gt } from 'drizzle-orm';
import { getGravatarHash } from '$lib/utils/gravatar';
import {
  generateTokenId,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyAccessToken,
  verifyRefreshToken,
  type RefreshTokenPayload,
  type AccessTokenPayload,
} from '$lib/utils/auth/jwt';

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

export async function createTokens(
  userData: NonNullable<App.Locals['user']>,
  sessionMaxAge: Date
) {
  const tokenId = generateTokenId();

  const refreshPayload: RefreshTokenPayload = {
    userId: userData.id,
    tokenId,
  };

  const accessToken = await generateAccessToken(userData);
  const refreshToken = await generateRefreshToken(refreshPayload, sessionMaxAge);

  await db.insert(RefreshTokens).values({
    id: tokenId,
    user_id: userData.id,
    token_hash: hashToken(refreshToken),
    expires_at: sessionMaxAge,
  });

  return {
    success: true,
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(refreshToken: string, accessToken: string) {
  const refreshTokenPayload = await verifyRefreshToken(refreshToken);
  const accessTokenPayload = await verifyAccessToken(accessToken);

  if (!refreshTokenPayload) {
    throw new Error('Invalid refresh token');
  }

  if (!accessTokenPayload) {
    throw new Error('Invalid access token');
  }

  const tokenHash = hashToken(refreshToken);
  const tokenRecord = await db.query.RefreshTokens.findFirst({
    where: and(
      eq(RefreshTokens.id, refreshTokenPayload.tokenId),
      eq(RefreshTokens.user_id, Users.id),
      eq(RefreshTokens.token_hash, tokenHash),
      gt(RefreshTokens.expires_at, new Date())
    ),
    with: {
      User: true,
    },
  });

  if (!tokenRecord) {
    throw new Error('Refresh token not found or expired');
  }

  await db
    .update(RefreshTokens)
    .set({
      last_used_at: new Date(),
    })
    .where(eq(RefreshTokens.id, refreshTokenPayload.tokenId));

  const accessPayload: AccessTokenPayload = {
    id: refreshTokenPayload.userId,
    username: accessTokenPayload.username,
    name: accessTokenPayload.name,
    created_at: accessTokenPayload.created_at,
    password_reset_required: accessTokenPayload.password_reset_required,
    phone_number: accessTokenPayload.phone_number,
    national_id: accessTokenPayload.national_id,
    role: tokenRecord.User.role,
    last_login: accessTokenPayload.last_login,
    gravatar: accessTokenPayload.gravatar,
    email: accessTokenPayload.email,
  };

  const newAccessToken = await generateAccessToken(accessPayload);

  return {
    accessToken: newAccessToken,
    user: accessPayload,
  };
}

export async function logoutUser(refreshToken: string) {
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    return;
  }
  await db.delete(RefreshTokens).where(eq(RefreshTokens.id, payload.tokenId));
}

export async function logoutAllDevices(userId: number) {
  await db.delete(RefreshTokens).where(eq(RefreshTokens.user_id, userId));
}

export async function rotateRefreshToken(oldRefreshToken: string, sessionMaxAge: Date) {
  const payload = await verifyRefreshToken(oldRefreshToken);
  if (!payload) {
    throw new Error('Invalid refresh token');
  }

  await db.delete(RefreshTokens).where(eq(RefreshTokens.id, payload.tokenId));

  const user = await db.query.Users.findFirst({ where: eq(Users.id, payload.userId) });

  if (!user) {
    throw new Error('User not found');
  }

  const userData = {
    ...user,
    gravatar: user.email
      ? `https://0.gravatar.com/avatar/${getGravatarHash(user.email)}`
      : '/default-profile.jpg',
  };

  return await createTokens(userData, sessionMaxAge);
}
