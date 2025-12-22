import { db } from "./db";
import {
  calculations,
  type Calculation,
  type InsertCalculation
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  saveCalculation(calc: InsertCalculation & { result: string; latex: string }): Promise<Calculation>;
  getHistory(): Promise<Calculation[]>;
  clearHistory(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async saveCalculation(calc: InsertCalculation & { result: string; latex: string }): Promise<Calculation> {
    const [saved] = await db
      .insert(calculations)
      .values(calc)
      .returning();
    return saved;
  }

  async getHistory(): Promise<Calculation[]> {
    return await db
      .select()
      .from(calculations)
      .orderBy(desc(calculations.createdAt))
      .limit(50);
  }

  async clearHistory(): Promise<void> {
    await db.delete(calculations);
  }
}

export const storage = new DatabaseStorage();
