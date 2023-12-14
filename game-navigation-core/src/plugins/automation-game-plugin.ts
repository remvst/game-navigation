import { GamePlugin } from "../game/game-plugin";

export class AutomationGamePlugin extends GamePlugin {

    static readonly key = 'automation';
    readonly key = AutomationGamePlugin.key;

    // Debug
    protected automationLabel: HTMLDivElement;

    get timeFactor(): number {
        return this.automationTimeFactor;
    }

    constructor(private readonly automationTimeFactor = 5) {
        super();
    }

    setup(): void {
        this.automationLabel = document.createElement('div');
        this.automationLabel.id = 'automation-label';
        document.body.appendChild(this.automationLabel);
    }

    render(): void {
        const automation = {};
        this.getAutomationValues(automation);
        this.automationLabel.innerText = JSON.stringify(automation);

        // Disable all CSS animations for automation
        const styleElement = document.createElement('style');
        styleElement.setAttribute('id','style-tag');
        styleElement.innerHTML = '*,:after,:before,.animate-in{transition:none!important;animation:none!important;}';
        document.head.appendChild(styleElement);
    }

    getAutomationValues(out: {[key: string]: any}) {
        this.game.getDebugValues(out);
    }
}
