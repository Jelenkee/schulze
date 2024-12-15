import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { USER_COOKIE } from '../lib/constants.ts';
import { createSurvey, createVote, getSurvey } from '../lib/db.ts';

export const server = {
    createSurvey: defineAction({
        input: z.object({
            title: z.string().trim().min(1).max(50),
            candidates: z.array(z.string().trim().min(1).max(50)).min(2).max(100)
        }),
        handler: async (input) => {
            const { title: name, candidates } = input;

            return await createSurvey(name, candidates);
        }
    }),
    submitVote: defineAction({
        input: z.object({
            surveyId: z.string().regex(/[0-7][0-9A-HJKMNP-TV-Z]{25}/),
            candidates: z.array(z.number().multipleOf(1)).min(2),
            userName: z.string().min(3).max(30),
        }),
        handler: async (input, context) => {
            const cookie = context.cookies.get(USER_COOKIE);
            if (cookie == null) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Missing cookie"
                });
            }
            const { surveyId, candidates, userName } = input;
            const userId = cookie.value;

            const survey = await getSurvey(surveyId);
            if (survey == null) {
                throw new ActionError({
                    code: "NOT_FOUND",
                    message: "Survey not found"
                });
            }
            if (survey.candidates.length != candidates.length) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: `Expected length: ${survey.candidates.length}, received length: ${candidates.length}`
                })
            }

            return await createVote(surveyId, userId, userName, candidates);
        }
    })
}