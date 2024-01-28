export class StoredItem<T> {
    constructor(
        private readonly localJsonStore: LocalJsonStore,
        readonly key: string,
    ) {

    }

    get(): Promise<T | null> {
        return this.localJsonStore.getItem(this.key);
    }

    set(value: T): Promise<void> {
        return this.localJsonStore.setItem(this.key, value);
    }

    delete(): Promise<void> {
        return this.localJsonStore.deleteItem(this.key);
    }
}

export class LocalJsonStore {
    constructor(
        private readonly localStorage: Storage,
    ) {
    }

    item<T>(key: string): StoredItem<T> {
        return new StoredItem(this, key);
    }

    async setItem(key: string, value: any): Promise<void> {
        try {
            this.localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error(`setItem error: ${err.message}`, err)
            throw err;
        }
    }

    async deleteItem(key: string): Promise<void> {
        try {
           this.localStorage.removeItem(key);
        } catch (err) {
            console.error(`deleteItem error: ${err.message}`, err)
            throw err;
        }
    }

    async getItem(key: string): Promise<any> {
        try {
            const stored = this.localStorage.getItem(key);
            if (!stored) return null;
            return JSON.parse(stored);
        } catch (err) {
            console.error(`getItem error: ${err.message}. Falling back to null`, err)
            return null;
        }
    }
};
