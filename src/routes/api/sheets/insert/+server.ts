import { google } from 'googleapis';
import { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } from '$env/static/private';

export async function POST({ request }) {
  const body = await request.json();
  const { spreadsheetId, sheetName, rows } = body;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      includeValuesInResponse: true,
      requestBody: {
        values: rows,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        response,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
