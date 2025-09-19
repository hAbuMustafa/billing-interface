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

export function seed(items: any[], insertFunction: Function) {
  console.warn('Starting seed..');
  console.time('seed');

  items.forEach(async (itm: any) => {
    console.info('Seeding:', itm.username);

    const i = await insertFunction(itm);

    if (!i.success) {
      console.error(
        'Failed adding',
        JSON.stringify(itm, null, 4),
        'with error:\n',
        i.error
      );
    }
  });

  console.timeEnd('seed');
  console.info('Done Seeding');
}

function beginSeed() {
  // Seed Menu Lists
  seed(new_Wards, createWard);
  seed(new_id_doc_type, createIdDocType);
  seed(new_Patient_dismissal_reasons, createDismissalReason);
  seed(new_Drugs_unit, createDrugUnit);
  seed(new_Drugs_category, createDrugCategory);

  // Seed Initial Data
  seed(new_Users, createUser);
  seed(new_Drugs, createDrug);
  seed(new_Patients, createPatient);
  seed(new_PatientTransfers, transferPatient);
}

// beginSeed()

// fix: convert google sheets date serial to JS epoch time: (serial - 25569) * 24 * 60 * 60 * 1000
