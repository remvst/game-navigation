import { InMemoryStorage } from "./in-memory-storage";

export function getClientStorage(): Storage {
    const options: [string, () => Storage][] = [
        ["localStorage", () => window.localStorage],
        ["sessionStorage", () => window.sessionStorage],
        ["InMemoryStorage", () => new InMemoryStorage()],
    ];

    for (const [label, getter] of options) {
        try {
            const storage = getter();
            if (!storage) {
                throw new Error(`${label} getter returned falsy`);
            }
            return storage;
        } catch (err) {
            console.error(`Failed to get ${label} (${err.message}), falling back`, err);
        }
    }
}
