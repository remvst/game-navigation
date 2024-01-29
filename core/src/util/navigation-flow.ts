import { UserCancelledError } from "../navigation/resolver";

export async function navigationFlow<T>(flow: Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await flow);
        } catch (err) {
            if (err instanceof UserCancelledError) {
                return;
            }
            reject(err);
        }
    });
}
