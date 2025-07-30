import { google } from 'googleapis';
import { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } from '$env/static/private';
import { regexify } from 'extend-arabic-query';
import { remodelRowsToObject, sortRows } from '../../utils';

export async function POST({ request }) {
  const body = await request.json();
  const { spreadsheetId, range, filterBy, filterValue, sortBy, withTableHeader } = body;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'SERIAL_NUMBER',
    });
    const values = response.data;
    const remodeledValues = remodelRowsToObject(values.values);

    if (!withTableHeader) remodeledValues.shift();

    if (sortBy) {
      sortRows(remodeledValues, sortBy);
    }

    let filteredData = null;

    // todo: separate into a different function
    // todo: allow filtering with multiple columns and values
    if (!!(filterBy && filterValue)) {
      filteredData = remodeledValues.filter((row: { [key: string]: string }) =>
        regexify(filterValue).test(row[filterBy])
      );

      if (filteredData.length === 0) {
        filteredData = [remodeledValues[0]];
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        rows: filteredData || remodeledValues,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
