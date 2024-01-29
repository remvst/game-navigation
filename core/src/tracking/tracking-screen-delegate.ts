import { Screen } from "../ui/screen";
import { ScreenDelegate } from "../ui/screen-delegate";
import { PropertiesProvider } from "./properties-provider";
import { Properties, Tracker } from "./tracker";

export class TrackingScreenDelegate implements ScreenDelegate {
    constructor(
        private readonly screen: Screen,
        private readonly tracker: Tracker,
    ) {}

    private properties(extraProperties: Properties) {
        const merged: Properties = {
            "screen.id": this.screen.id,
            "screen.age": this.screen.age,
        };

        Object.assign(merged, extraProperties);

        const screenProperties = (this.screen as any as PropertiesProvider)
            .properties;
        if (screenProperties) {
            Object.assign(merged, screenProperties);
        }

        return merged;
    }

    private track(eventName: string, extraProperties: Properties = {}) {
        this.tracker.track(eventName, this.properties(extraProperties));
    }

    onSetup(): void {
        this.track("screenSetup");
    }

    onForeground(): void {
        this.track("screenForeground");
    }

    onBackground(): void {
        this.track("screenBackground");
    }

    onDestroy(): void {
        this.track("screenDestroy");
    }
}
