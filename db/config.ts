import { defineDb, defineTable, column, NOW } from 'astro:db';

export const Survey = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    candidates: column.json(),
    createdAt: column.date({ default: NOW }),
  }
})

export const Vote = defineTable({
  columns: {
    surveyId: column.text({ references: () => Survey.columns.id }),
    userId: column.text(),
    userName: column.text(),
    candidates: column.json(),
  },
  indexes: [
    { on: "surveyId" },
    { on: ["surveyId", "userId"], unique: true }
  ]
})

export default defineDb({
  tables: { Survey, Vote }
});
