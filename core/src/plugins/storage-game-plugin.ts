import { GamePlugin } from "../game/game-plugin";
import { getClientStorage } from "../storage/get-client-storage";
import { LocalJsonStore } from "../storage/local-json-store";

export class StorageGamePlugin extends GamePlugin {
    static readonly key = "storage";
    readonly key = StorageGamePlugin.key;
    readonly localJsonStore = new LocalJsonStore(getClientStorage());
}
