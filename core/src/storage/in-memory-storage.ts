export class InMemoryStorage implements Storage {

    private readonly items = new Map<string, string>;

    get length(): number {
        return this.items.size;
    }

    clear(): void {
        this.items.clear();
    }

    getItem(key: string): string {
        return this.items.get(key);
    }

    key(index: number): string {
        throw new Error("Method not implemented.");
    }

    removeItem(key: string): void {
        this.items.delete(key);
    }

    setItem(key: string, value: string): void {
        this.items.set(key, value);
    }

}
