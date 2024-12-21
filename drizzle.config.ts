import {defineConfig, type Config} from "drizzle-kit";


export default defineConfig({
    schema: "./src/lib/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.PG_URL ?? "<empty>"
    }
}) satisfies Config;