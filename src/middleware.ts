import { defineMiddleware } from "astro:middleware";
import { USER_COOKIE } from "./lib/constants.ts";
import { ulid } from "ulid";

export const onRequest = defineMiddleware(async (context, next) => {
    const cookie = context.cookies.get(USER_COOKIE);
    const response = await next();

    if (cookie == null) {
        response.headers.append("Set-Cookie", `${USER_COOKIE}=${ulid()}; HttpOnly; Secure`)
    }
    return response;
});