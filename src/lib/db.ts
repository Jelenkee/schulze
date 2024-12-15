import { db, eq, Survey, Vote } from "astro:db";
import { ulid } from "ulid";

type Survey2 = Omit<typeof Survey.$inferSelect, "candidates"> & { candidates: string[] }

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

export async function getSurveyResult(surveyId: string) {
    const resultSet = await db.select().from(Survey).innerJoin(Vote, eq(Survey.id, Vote.surveyId));
    // TODO
}

