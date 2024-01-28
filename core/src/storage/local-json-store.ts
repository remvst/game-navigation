export class LocalJsonStore {
    constructor(
        private readonly localStorage: Storage,
    ) {
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
            return JSON.parse(this.localStorage.getItem(key));
        } catch (err) {
            console.error(`getItem error: ${err.message}. Falling back to null`, err)
            return null;
        }
    }
};
