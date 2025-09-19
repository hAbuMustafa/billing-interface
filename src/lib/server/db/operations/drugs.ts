import { db } from '$lib/server/db';
import { Drugs, Drugs_category, Drugs_unit, Ph_InEco_Stock } from '$lib/server/db/schema';

export async function createDrugUnit(unit: typeof Drugs_unit.$inferInsert) {
  try {
    const [drugUnit] = await db.insert(Drugs_unit).values(unit).returning();

    return {
      success: true,
      data: drugUnit,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function createDrugCategory(category: typeof Drugs_category.$inferInsert) {
  try {
    const [drugCategory] = await db.insert(Drugs_category).values(category).returning();

    return {
      success: true,
      data: drugCategory,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export async function createDrug(
  drug: typeof Drugs.$inferInsert & typeof Ph_InEco_Stock.$inferInsert
) {
  try {
    const [dr] = await db.insert(Drugs).values(drug).returning();

    const [stockItem] = await db
      .insert(Ph_InEco_Stock)
      .values({
        drug_id: dr.id,
        price_purchase: drug.price_purchase,
        amount: drug.amount,
      })
      .returning();

    return { success: true, data: stockItem };
  } catch (error) {
    return {
      error,
    };
  }
}
