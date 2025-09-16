import { db } from '$lib/server/db';
import { Drugs, Drugs_category, Drugs_unit, Ph_InEco_Stock } from '$lib/server/db/schema';

export async function createDrugUnit(unit: typeof Drugs_unit.$inferInsert) {
  const ins = await db.insert(Drugs_unit).values(unit).returning();

  return ins[0];
}

export async function createDrugCategory(category: typeof Drugs_category.$inferInsert) {
  const ins = await db.insert(Drugs_category).values(category).returning();

  return ins[0];
}

export async function createDrug(
  drug: typeof Drugs.$inferInsert & typeof Ph_InEco_Stock.$inferInsert
) {
  const dr = await db.insert(Drugs).values(drug).returning();

  const stockItem = await db
    .insert(Ph_InEco_Stock)
    .values({
      drug_id: dr[0].id,
      price_purchase: drug.price_purchase,
      amount: drug.amount,
    })
    .returning();

  return stockItem[0];
}
