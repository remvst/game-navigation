import { UserCancelledError } from "../navigation/resolver";

export function navigationFlow<T>(flow: Promise<T>) {
    flow.catch((err) => {
        if (err instanceof UserCancelledError) return;
        console.error(err);
    });
}
