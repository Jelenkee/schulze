import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
    createVote: defineAction({
        input: z.object({
            title: z.string(),
            candidates: z.array(z.string())
        }),
        handler: async (input) => {
            console.log(input);

            return "ulid"
        }
    }),
    submitVote: defineAction({
        input: z.object({
            id: z.string(),
            candidates: z.array(z.string())
        }),
        handler: async (input) => {
            return `success`
        }
    })
}