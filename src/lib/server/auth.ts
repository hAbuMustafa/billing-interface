import { PUBLIC_users_spreadsheetId } from '$env/static/public';
import { dateFromExcelSerial, dateToExcelSerial } from '$lib/utils/date-format';
import { getGravatarHash } from '$lib/utils/gravatar';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function createUser(
  username: string,
  name: string,
  email: string,
  phoneNumber: string,
  password: string,
  fetchFunc: Function
) {
  const userId = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const response = await fetchFunc('/api/sheets/insert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetId: PUBLIC_users_spreadsheetId,
      sheetName: 'users',
      rows: [
        [
          userId,
          username,
          name,
          email,
          phoneNumber,
          passwordHash,
          dateToExcelSerial(new Date().getTime()),
        ],
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

  return user.id;
}

export async function createSession(userId: string, cookies: any, fetchFunc: Function) {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  const response = await fetchFunc('/api/sheets/insert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetId: PUBLIC_users_spreadsheetId,
      sheetName: 'sessions',
      rows: [[sessionId, userId, dateToExcelSerial(expiresAt.getTime())]],
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

export async function getUserFromSession(sessionId: string, fetchFunc: Function) {
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

  if (dateFromExcelSerial(sessionsData.rows[0].expires_at) < Date.now()) {
    await fetchFunc('/api/sheets/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spreadsheetId: PUBLIC_users_spreadsheetId,
        sheetName: 'sessions',
        sheetRange: 'A:C',
        columnIndex: 0,
        targetValue: sessionsData.rows[0].id,
      }),
    });
    // todo: delete cookies first, or simply: await fetchFunc('/logout');
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
      filterBy: 'id',
      filterValue: sessionsData.rows[0].user_id,
      filterMethod: 'equal',
      withTableHeader: false,
    }),
  });

  const usersData = await usersResponse.json();

  if (usersData.rows.length === 0) return null;

  const user = usersData.rows[0];

  user.gravatar = user.email
    ? `https://0.gravatar.com/avatar/${getGravatarHash(user.email)}`
    : '/default-profile.jpg';

  delete user.password_hash;

  return user;
}
