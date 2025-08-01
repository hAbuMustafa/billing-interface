import { sheets } from '../../utils';

export async function POST({ request }) {
  const body = await request.json();
  const { spreadsheetId, sheetName, rows } = body;

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
