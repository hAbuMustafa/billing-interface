import { PUBLIC_users_spreadsheetId } from '$env/static/public';
import { dateFromExcelSerial, dateToExcelSerial } from '$lib/utils/date-format';
import { db } from './db';
import bcrypt from 'bcryptjs';

// todo: convert all this logic to use Google Sheets instead of SQLite

type UserT = App.Locals['user'];

const SALT_ROUNDS = 12;

export async function createUser(
  username: string,
  name: string,
  phoneNumber: string,
  password: string,
  fetchFunc: Function
) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const response = await fetchFunc('/api/sheets/insert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetId: PUBLIC_users_spreadsheetId,
      sheetName: 'users',
      rows: [
        [username, name, phoneNumber, hash, dateToExcelSerial(new Date().toString())],
      ],
    }),
  });

  const data = await response.json();

  return {
    id: data.response.data.updates.updatedData.values,
    username,
    name,
    phoneNumber,
  };
}

export async function validateUser(username: string, password: string) {
  const user = db
    .prepare(`SELECT * FROM users WHERE username = ?`)
    .get(username) as UserT;

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    phone_number: user.phone_number,
  };
}

export function createSession(userId: number, cookies: any) {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  db.prepare(`INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`).run(
    sessionId,
    userId,
    expiresAt.toISOString()
  );

  cookies.set('session_id', sessionId, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt,
  });
}

export function getSession(cookies: any) {
  const sessionId = cookies.get('session_id');
  if (!sessionId) return null;

  return db
    .prepare(
      "SELECT users.id, users.username, users.name, users.phone_number FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.id = ? AND sessions.expires_at > datetime('now')"
    )
    .get(sessionId) as UserT;
}

export function deleteSession(cookies: any) {
  const sessionId = cookies.get('session_id');
  if (sessionId) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    cookies.delete('session_id', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
}
