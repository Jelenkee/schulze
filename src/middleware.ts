import { defineMiddleware } from "astro:middleware";
import { USER_ID_COOKIE } from "./lib/constants.ts";
import { ulid } from "ulid";

export const onRequest = defineMiddleware(async (context, next) => {
    const cookieId = context.cookies.get(USER_ID_COOKIE);
    const response = await next();

    if (cookieId == null) {
        response.headers.append("Set-Cookie", `${USER_ID_COOKIE}=${ulid()}; HttpOnly; Secure; Path=/`)
    }
    return response;
});