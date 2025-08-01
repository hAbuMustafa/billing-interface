import { deleteRowByCondition } from '../../utils';

export async function POST({ request }) {
  const body = await request.json();
  const { spreadsheetId, sheetName, sheetRange, columnIndex, targetValue } = body;

  try {
    const response = await deleteRowByCondition(
      spreadsheetId,
      sheetName,
      sheetRange,
      columnIndex,
      targetValue
    );

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
