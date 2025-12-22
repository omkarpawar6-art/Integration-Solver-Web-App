import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  expression: text("expression").notNull(),
  variable: varchar("variable", { length: 10 }).default("x").notNull(),
  type: text("type", { enum: ["definite", "indefinite"] }).notNull(),
  lowerBound: text("lower_bound"), // stored as text to support symbolic bounds like "pi"
  upperBound: text("upper_bound"),
  result: text("result").notNull(), // text representation
  latex: text("latex"), // LaTeX representation for pretty printing
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true,
  result: true, // computed by server
  latex: true, // computed by server
});

export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
