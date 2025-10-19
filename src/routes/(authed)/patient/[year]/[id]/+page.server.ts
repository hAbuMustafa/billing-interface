import { redirect } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

export async function load({ fetch, params }) {
  const admission_year = params.year;
  const patientSerial = params.id;

  if (!patientSerial || !admission_year) {
    toast('برجاء اختيار مريض أولا');
    return redirect(401, '/patient');
  }

  if (!/^\d{2}$/.test(admission_year) || !/^\d+$/.test(patientSerial)) {
    toast.error('برجاء إدخال أرقام صحيحة');
    return redirect(401, '/patient');
  }

  const castYear = Number(admission_year);
  const castSerial = Number(patientSerial);
  const currentYear = Number(new Date().getFullYear().toString().slice(2, 4));

  if (castYear < 24 || castYear > currentYear || patientSerial.length > 5) {
    toast.error('المريض غير موجود');
    return redirect(401, '/patient');
  }

  const patientData = await fetch(
    `/api/patients/patient?id=${[castYear, castSerial].join('/')}`
  ).then((r) => r.json());

  return {
    title: patientData[0].People.name,
    patient: patientData,
  };
}
