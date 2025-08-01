import { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } from '$env/static/private';
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const sheets = google.sheets({ version: 'v4', auth });

export function remodelRowsToObject(rows: any[][] | null | undefined) {
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

export function sortRows(
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

async function findRowToDelete(
  spreadsheetId: string,
  sheetName: string,
  sheetRange: string,
  columnIndexToCheck: number,
  targetValue: string | number
) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!${sheetRange}`,
  });

  const rows = response.data.values || [];
  const rowsToDelete: number[] = [];

  rows.forEach((row, index) => {
    if (row[columnIndexToCheck] === targetValue) {
      rowsToDelete.push(index + 1);
    }
  });

  return rowsToDelete;
}

async function deleteRows(spreadsheetId: string, sheetId: number, rowIndices: number[]) {
  rowIndices.sort((a, b) => b - a);

  const response = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: rowIndices.map((rowIndex) => ({
        deleteDimension: {
          range: {
            sheetId: sheetId,
            dimension: 'ROWS',
            startIndex: rowIndex - 1,
            endIndex: rowIndex,
          },
        },
      })),
    },
  });

  return response;
}

export async function deleteRowByCondition(
  spreadsheetId: string,
  sheetName: string,
  sheetRange: string,
  columnIndex: number,
  targetValue: string | number
) {
  const metadata = await sheets.spreadsheets.get({ spreadsheetId });

  if (!metadata || !metadata.data.sheets) {
    console.error(`No spreadsheet was found with the specified id ${spreadsheetId}`);
    return;
  }

  const sheet = metadata.data.sheets.find(
    (s) => s.properties && s.properties.title === sheetName
  );

  if (!sheet) {
    console.error(`Sheet ${sheetName} was not found in the specified spreadsheet`);
    return;
  }
  const sheetId = sheet.properties?.sheetId as number;

  try {
    const rowsToDelete = await findRowToDelete(
      spreadsheetId,
      sheetName,
      sheetRange,
      columnIndex,
      targetValue
    );

    if (rowsToDelete.length === 0) {
      console.warn('No matching rows found');
      return;
    }

    await deleteRows(spreadsheetId, sheetId, rowsToDelete);
  } catch (error) {
    console.error('Error deleting row:', error);
  }
}
