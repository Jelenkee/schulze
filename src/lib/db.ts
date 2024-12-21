import { db, eq, Survey, Vote } from "astro:db";
import { ulid } from "ulid";

export type Survey2 = Omit<typeof Survey.$inferSelect, "candidates"> & { candidates: string[] }
export type Vote2 = Omit<typeof Vote.$inferSelect, "candidates" | "surveyId"> & { candidates: number[] }

export async function createSurvey(name: string, candidates: string[]): Promise<string> {
    const id = ulid();
    await db.insert(Survey).values({ id, name, candidates });
    console.log(`Created survey ${id} (${name})`);
    return id;
}

export async function createVote(surveyId: string, userId: string, userName: string, candidates: number[]) {
    await db.insert(Vote).values({ surveyId, userId, userName, candidates }).onConflictDoUpdate({
        target: [Vote.surveyId, Vote.userId],
        set: { userName, candidates }
    });
    console.log(`Submitted vote from ${userId} (${userName}) for survey ${surveyId}`);
}

export async function getSurvey(surveyId: string): Promise<Survey2 | undefined> {
    const resultSet = await db.select().from(Survey).where(eq(Survey.id, surveyId));
    return resultSet[0] as Survey2;
}

export async function getSurveyResult(surveyId: string): Promise<{ survey: Survey2, votes: Vote2[] } | undefined> {
    const resultSet = await db.select().from(Survey).leftJoin(Vote,eq(Survey.id, Vote.surveyId)).where( eq(Survey.id, surveyId));
    if (!resultSet.length) {
        return;
    }
    
    return {
        survey: resultSet[0].Survey as Survey2,
        votes: resultSet.map(r => r.Vote as Vote2)
    }
}

