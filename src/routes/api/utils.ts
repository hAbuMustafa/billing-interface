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
