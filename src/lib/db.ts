import { drizzle } from "drizzle-orm/node-postgres";
import { ulid } from "ulid";
import { Survey, Vote } from "./schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(import.meta.env.PG_URL ?? "<empty>")

export type Survey2 = Omit<typeof Survey.$inferSelect, "candidates"> & { candidates: string[] }
export type Vote2 = Omit<typeof Vote.$inferSelect, "candidates" | "surveyId"> & { candidates: number[] }

export async function createSurvey(name: string, candidates: string[]): Promise<string> {
    const id = ulid();
    await db.insert(Survey).values({ id, name, candidates: JSON.stringify(candidates) });
    console.log(`Created survey ${id} (${name})`);
    return id;
}

export async function createVote(surveyId: string, userId: string, userName: string, candidates: number[]) {
    await db.insert(Vote).values({ surveyId, userId, userName, candidates: JSON.stringify(candidates) }).onConflictDoUpdate({
        target: [Vote.surveyId, Vote.userId],
        set: { userName, candidates: JSON.stringify(candidates) }
    });
    console.log(`Submitted vote from ${userId} (${userName}) for survey ${surveyId}`);
}

export async function getSurvey(surveyId: string): Promise<Survey2 | undefined> {
    const resultSet = await db.select().from(Survey).where(eq(Survey.id, surveyId));
    if (!resultSet.length) {
        return;
    }
    return convertSurvey(resultSet[0]);
}

export async function getSurveyResult(surveyId: string): Promise<{ survey: Survey2, votes: Vote2[] } | undefined> {
    const resultSet = await db.select().from(Survey).leftJoin(Vote, eq(Survey.id, Vote.surveyId)).where(eq(Survey.id, surveyId));
    if (!resultSet.length) {
        return;
    }

    const votes: Array<typeof Vote.$inferSelect> = resultSet.map($ => $.votes).filter(($): $ is typeof Vote.$inferSelect => $ != null)
    return {
        survey: convertSurvey(resultSet[0].surveys),
        votes: votes.map(convertVote),
    }
}

function convertSurvey(survey: typeof Survey.$inferSelect): Survey2 {
    return {
        ...survey,
        candidates: JSON.parse(survey.candidates)
    }
}

function convertVote(vote: typeof Vote.$inferSelect): Vote2 {
    return {
        ...vote,
        candidates: JSON.parse(vote.candidates)
    }
}


