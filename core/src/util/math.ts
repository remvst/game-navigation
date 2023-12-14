export function between(a: number, b: number, c: number) {
    if (b < a) return a;
    if (b > c) return c;
    return b;
};
