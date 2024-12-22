import { bigserial, index, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const Survey = pgTable("surveys", {
    id: varchar({ length: 128 }).primaryKey(),
    name: text().notNull(),
    candidates: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
}, t => [])

export const Vote = pgTable("votes", {
    id: bigserial({ mode: "number" }).primaryKey(),
    surveyId: varchar({ length: 128 }).notNull().references(() => Survey.id, { onDelete: "cascade" }),
    userId: varchar({ length: 128 }).notNull(),
    userName: text().notNull(),
    candidates: text().notNull(),
}, t => [
    index().on(t.surveyId),
    uniqueIndex().on(t.surveyId, t.userId),
])
