import { UserCancelledError } from "../navigation/resolver";

export function navigationFlow<T>(flow: Promise<T> | (() => Promise<T>)): void {
    let promise: Promise<T>;

    if (flow instanceof Function) {
        promise = flow();
    }

    if (flow instanceof Promise) {
        promise = flow;
    }

    promise.catch((err) => {
        if (err instanceof UserCancelledError) return;
        console.error(err);
    });
}

export function navigationClickHandler<T>(flow: (() => Promise<T>)): () => void {
    return () => navigationFlow(flow);
}