import { and, db, eq, Survey, Vote, pgTable } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";



export const Survey = pgTable({
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