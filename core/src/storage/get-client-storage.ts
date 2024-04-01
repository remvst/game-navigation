import { InMemoryStorage } from "./in-memory-storage";

export function getClientStorage(): Storage {
    const options: [string, () => Storage][] = [
        ["localStorage", () => window.localStorage],
        ["sessionStorage", () => window.sessionStorage],
        ["InMemoryStorage", () => new InMemoryStorage()],
    ];

    for (const [label, getter] of options) {
        try {
            return getter();
        } catch (err) {
            console.error(`Failed to get ${label} (${err.message}), falling back`, err);
        }
    }
}
