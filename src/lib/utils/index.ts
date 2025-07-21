export async function getData(
  spreadsheetId: string,
  range: string,
  filterBy?: string,
  filterValue?: string,
  sortBy?: { columnName: string; sortOrder?: 'asc' | 'desc' }[],
  withTableHeader: boolean = true
) {
  const response = await fetch(`/api/sheets/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetId,
      range,
      filterBy,
      filterValue,
      sortBy: sortBy,
      withTableHeader,
    }),
  });

  const data = await response.json();
  return data;
}
