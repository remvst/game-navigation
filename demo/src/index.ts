import { MyGame } from "./my-game";

window.addEventListener('load', async () => {
    const game = new MyGame({
        'width': 800,
        'height': 600,
    });
    game.setup();
});
