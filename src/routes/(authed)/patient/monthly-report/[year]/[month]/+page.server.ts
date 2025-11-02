export async function load({ params, fetch }) {
  const pageData = {
    title: `إحصائية الإشغال لشهر ${params.month}/${params.year}`,
  };

  if (
    !/^20(2[4-9]|[3-9]\d)$/.test(params.year) ||
    !/^([1-9])|(0[1-9])|(1[0-2])$/.test(params.month)
  ) {
    return pageData;
  }

  const result = await fetch(
    `/api/patients/monthly-report?year=${params.year}&month=${params.month}`
  ).then((r) => {
    if (r.ok) {
      return r.json();
    }
  });

  return {
    title: `إحصائية الإشغال لشهر ${params.month}/${params.year}`,
    stats: result,
  };
}
