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
    success: true,
  };
}

export async function isUniqueUser(
  username: string,
  fetchFunc: Function
): Promise<boolean> {
  const response = await fetchFunc('/api/sheets/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetId: PUBLIC_users_spreadsheetId,
      range: 'users!A:H',
      filterBy: 'username',
      filterValue: username,
      filterMethod: 'equal',
      withTableHeader: false,
    }),
  });

  const data = await response.json();

  return data.rows.length === 0;
}

export async function validateUser(
  username: string,
  password: string,
  fetchFunc: Function
) {
  const response = await fetchFunc('/api/sheets/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetId: PUBLIC_users_spreadsheetId,
      range: 'users!A:H',
      filterBy: 'username',
      filterValue: username,
      filterMethod: 'equal',
      withTableHeader: false,
    }),
  });

  const data = await response.json();

  const user = data.rows[0];

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return null;
  }

  return {
    username: user.username,
    name: user.name,
    phoneNumber: user.phone_number,
    isWarehouse: user.is_warehouse,
    isActive: user.active,
    lastLogin: user.last_login,
  };
}

export async function createSession(username: string, cookies: any, fetchFunc: Function) {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 4); //fix: Why it only accommodates for 1hr?
  const response = await fetchFunc('/api/sheets/insert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetId: PUBLIC_users_spreadsheetId,
      sheetName: 'sessions',
      rows: [[sessionId, username, dateToExcelSerial(expiresAt.toString())]],
    }),
  });

  const data = await response.json();

  cookies.set('session_id', sessionId, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt,
  });
}

export async function getSession(cookies: any, fetchFunc: Function) {
  const sessionId = cookies.get('session_id');
  if (!sessionId) return null;

  const sessionsResponse = await fetchFunc('/api/sheets/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetId: PUBLIC_users_spreadsheetId,
      range: 'sessions!A:C',
      filterBy: 'id',
      filterValue: sessionId,
      filterMethod: 'equal',
      withTableHeader: false,
    }),
  });

  const sessionsData = await sessionsResponse.json();

  if (sessionsData.rows.length === 0) return null;

  if (
    (dateFromExcelSerial(sessionsData.rows[0].expires_at, '', true) as number) -
      Date.now() <
    0
  ) {
    //todo: delete this very session
    return null;
  }

  const usersResponse = await fetchFunc('/api/sheets/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetId: PUBLIC_users_spreadsheetId,
      range: 'users!A:H',
      filterBy: 'username',
      filterValue: sessionsData.rows[0].username,
      filterMethod: 'equal',
      withTableHeader: false,
    }),
  });

  const usersData = await usersResponse.json();

  if (usersData.rows.length === 0) return null;

  return usersData.rows[0];
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
