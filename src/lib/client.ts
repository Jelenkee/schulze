import { ActionError, ActionInputError } from "astro:actions";
import { toast } from "@zerodevx/svelte-toast";

export function handleError(error: Error) {
    let message;
    if (error instanceof ActionInputError && error.fields) {
        message = Object.keys(error.fields)
            .map(key => `${key}: ${error.fields[key]}`)
            .join("\n")
    } else if (error instanceof ActionError) {
        message = error.message;
    } else {
        message = "Server Error"
    }
    if (message) {
        toast.push(message, {
            theme: {
                "--toastColor": "white",
                "--toastBackground": "red",
                "--toastBarBackground": "darkred",
            },
        });
    }
}