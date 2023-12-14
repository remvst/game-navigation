import { Game } from "./game";

export abstract class GamePlugin {

    protected game: Game;

    get timeFactor(): number {
        return 1;
    }

    bind(game: Game) {
        this.game = game;
    }

    abstract get key(): string;
    abstract setup(): void;
    abstract render(): void;
}
