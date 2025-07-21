import { google } from 'googleapis';
import { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } from '$env/static/private';
import { regexify } from 'extend-arabic-query';

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
    });
    const values = response.data;
    const remodeledValues = remodelRowsToObject(values.values);

    if (!withTableHeader) remodeledValues.shift();

    if (sortBy) {
      sortRows(remodeledValues, sortBy);
    }

    let filteredData = null;

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

function remodelRowsToObject(rows: any[][] | null | undefined) {
  if (!rows || rows.length === 0) {
    return [];
  }
  const headings = rows[0];
  const jsonData = rows.map((row) => {
    const jsonObject: { [key: string]: string } = {};
    row.forEach((value, index) => {
      const key = headings[index];
      jsonObject[key] = value;
    });
    return jsonObject;
  });
  return jsonData;
}

function sortRows(
  rows: { [key: string]: string | number }[],
  sortBy: { columnName: string; sortOrder?: 'asc' | 'desc' }[]
) {
  sortBy.forEach((column: { columnName: string; sortOrder?: 'asc' | 'desc' }) => {
    rows.sort(
      (a: { [key: string]: string | number }, b: { [key: string]: string | number }) => {
        const aValue = a[column.columnName];
        const bValue = b[column.columnName];
        if (typeof bValue === 'number' && typeof aValue === 'number') {
          if (column.sortOrder === 'desc') {
            return bValue - aValue;
          }
          return aValue - bValue;
        } else if (/ء-ي/.test(bValue as string) || /ء-ي/.test(aValue as string)) {
          if (column.sortOrder === 'desc') {
            return (bValue as string).localeCompare(aValue as string);
          }
          return (aValue as string).localeCompare(bValue as string);
        } else {
          if (column.sortOrder === 'desc') {
            return (bValue as string) < (aValue as string) ? 1 : -1;
          }
          return (aValue as string) < (bValue as string) ? 1 : -1;
        }
      }
    );
  });
}
