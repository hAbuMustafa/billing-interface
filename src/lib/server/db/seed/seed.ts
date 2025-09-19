import { patients as new_Patients } from './data/patients';
import { drugs as new_Drugs } from './data/drugs';
import { users as new_Users } from './data/users';
import { transfers as new_PatientTransfers } from './data/patient_transfers';

import { createUser } from '$lib/server/db/operations/auth';
import {
  createWard,
  createIdDocType,
  createDismissalReason,
  createPatient,
  transferPatient,
} from '$lib/server/db/operations/patients';
import {
  createDrugUnit,
  createDrugCategory,
  createDrug,
} from '$lib/server/db/operations/drugs';

import {
  new_Wards,
  new_id_doc_type,
  new_Patient_dismissal_reasons,
  new_Drugs_unit,
  new_Drugs_category,
} from '$lib/server/db/menus';

export async function seed(items: any[], insertFunction: Function) {
  const seedName = insertFunction.name.replace('create', '');

  console.warn('\nStarting ' + seedName + ' seed..');

  console.time('seed ' + seedName);

  for (let i = 0; i < items.length; i++) {
    const itemReturn = await insertFunction(items[i]);

    if (!itemReturn.success) {
      console.error(
        'Failed adding',
        JSON.stringify(items[i], null, 4),
        'with error:\n',
        itemReturn.error
      );
      break;
    }
  }

  console.timeEnd('seed ' + seedName);
  console.info('Done Seeding ' + seedName);
}

export async function beginSeed() {
  // Seed Menu Lists
  seed(new_Wards, createWard);
  seed(new_id_doc_type, createIdDocType);
  seed(new_Patient_dismissal_reasons, createDismissalReason);
  seed(new_Drugs_unit, createDrugUnit);
  seed(new_Drugs_category, createDrugCategory);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Seed Initial Data
  seed(new_Users, createUser);
  seed(new_Drugs, createDrug);
  seed(new_Patients, createPatient);
  seed(new_PatientTransfers, transferPatient);
}
