import { regexify } from 'extend-arabic-query';
import { remodelRowsToObject, sortRows, sheets } from '../../utils';

export async function POST({ request }) {
  const body = await request.json();
  const {
    spreadsheetId,
    range,
    filterBy,
    filterValue,
    filterMethod,
    sortBy,
    withTableHeader,
  } = body;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'SERIAL_NUMBER',
    });
    const values = response.data.values;
    const remodeledValues = remodelRowsToObject(values);

    if (!withTableHeader) remodeledValues.shift();

    if (sortBy) {
      sortRows(remodeledValues, sortBy);
    }

    let filteredData = null;

    // todo: separate into a different function
    // todo: allow filtering with multiple columns and values
    if (!!(filterBy && filterValue)) {
      filteredData = remodeledValues.filter((row: { [key: string]: string }) =>
        filterMethod === 'equal'
          ? row[filterBy] === filterValue
          : regexify(filterValue).test(row[filterBy])
      );

      if (filteredData.length === 0 && withTableHeader === true) {
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
