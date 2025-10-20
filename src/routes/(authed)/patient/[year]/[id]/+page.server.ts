export async function load({ fetch, params }) {
  const admission_year = params.year;
  const patientSerial = params.id;

  if (!patientSerial || !admission_year) {
    return { message: 'برجاء اختيار مريض أولا' };
  }

  if (!/^\d{2}$/.test(admission_year) || !/^\d+$/.test(patientSerial)) {
    return { message: 'برجاء إدخال أرقام صحيحة' };
  }

  const castYear = Number(admission_year);
  const castSerial = Number(patientSerial);
  const currentYear = Number(new Date().getFullYear().toString().slice(2, 4));

  if (castYear < 24 || castYear > currentYear || patientSerial.length > 5) {
    return { message: 'المريض غير موجود' };
  }

  const patientId = [castYear, castSerial].join('/');

  const patientData = await fetch(`/api/patients/patient?id=${patientId}`).then((r) => {
    if (r.ok) {
      return r.json();
    }
  });

  if (!patientData)
    return {
      title: `لا يوجد مريض بالرقم ${patientId}`,
    };

  console.log(patientData);
  return {
    title: patientData.Person.name,
    patient: patientData,
  };
}
