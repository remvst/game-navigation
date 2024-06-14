![Build status](https://github.com/remvst/game-navigation/actions/workflows/check.yaml/badge.svg)

# game-navigation

Navigation system for HTML5 games.

## Installation

```sh
npm install @remvst/game-navigation-core

# Optional dependencies for extra plugins
npm install @remvst/game-navigation-html
npm install @remvst/game-navigation-react
npm install @remvst/game-navigation-pixi
npm install @remvst/game-navigation-sound
npm install @remvst/game-navigation-performance
```

## Usage

See `demo/` for a complete example.

```typescript
export class MyGame extends Game {
    readonly plugins = [
        new PIXIGamePlugin(document.querySelector("#canvas-container"), {
            resolution: 1,
            width: this.params.width,
            height: this.params.height,
        }),
        new HTMLGamePlugin(document.querySelector("#html-container")),
        new SoundGamePlugin(),
    ];

    setup(): void {
        super.setup();

        this.screenStack.reset(new SpinningSquareScreen(0xffffff));
    }

    readonly container = document.querySelector(
        "#game-container",
    ) as HTMLDivElement;
}

window.addEventListener("load", async () => {
    const game = new MyGame({
        width: 800,
        height: 600,
    });
    game.setup();
});
```
