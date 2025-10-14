import { db } from '$lib/server/db';
import {
  Drugs,
  Drug_categories,
  Drug_units,
  Ph_InEco_Stock,
} from '$lib/server/db/schema';

export async function createDrugUnit(unit: typeof Drug_units.$inferInsert) {
  try {
    const [drugUnit] = await db.insert(Drug_units).values(unit).returning();

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

export async function createDrugCategory(category: typeof Drug_categories.$inferInsert) {
  try {
    const [drugCategory] = await db.insert(Drug_categories).values(category).returning();

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
