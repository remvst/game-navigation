import { GamePlugin } from "../game/game-plugin";

const ICON_DATA = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpSIVQYuIOASsulgQFXHUKhShQqgVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4B/lqJqWbbOKBqlpGMx4R0ZlUIviKEHvRhFEMSM/U5UUzAc3zdw8fXuyjP8j735+hSsiYDfALxLNMNi3iDeHrT0jnvE4dZQVKIz4nHDLog8SPXZZffOOcd9vPMsJFKzhOHiYV8C8stzAqGSjxFHFFUjfL9aZcVzluc1VKFNe7JXxjKaivLXKc5iDgWsQQRAmRUUEQJFqK0aqSYSNJ+zMM/4PhFcsnkKoKRYwFlqJAcP/gf/O7WzE1OuEmhGND+Ytsfw0BwF6hXbfv72LbrJ0DgGbjSmv5yDZj5JL3a1CJHQPc2cHHd1OQ94HIH6H/SJUNypABNfy4HvJ/RN2WA3lugc83trbGP0wcgRV0lboCDQ2AkT9nrHu/uaO3t3zON/n4AqiVyvXIak4gAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfnAgQQGhZq6KlXAAAAK0lEQVQY02P8////fwYoYGRkZGRAAshyqBwc4P////+ZGIYToLqvGYkNcAAblh/vxNHP4AAAAABJRU5ErkJggg==';

export class FullscreenButtonGamePlugin extends GamePlugin {

    static readonly key = 'fullscreen-button';
    readonly key = FullscreenButtonGamePlugin.key;

    constructor(private readonly container: HTMLElement) {
        super();
    }

    setup(): void {
        super.setup();

        const styleElt = document.createElement('style');
        styleElt.innerHTML = `
            .fullscreen-button {
                position: absolute;
                z-index: 2;
                margin: 10px;
                top: 0;
                right: 0;
                cursor: pointer;
                width: 10px;
                height: 10px;
                background-image: url('data:image/png;base64,${ICON_DATA}');
                background-repeat: no-repeat;
                background-size: contain;
            }

            @media all and (display-mode: fullscreen) {
                .fullscreen-button {
                    display: none;
                }
            }
        `;
        document.head.appendChild(styleElt);

        const button = document.createElement('div');
        button.className = 'fullscreen-button';
        button.addEventListener('click', () => document.body.requestFullscreen(), false);
        this.container.appendChild(button);
    }
}
