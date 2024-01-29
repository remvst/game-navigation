import { GamePlugin } from "../game/game-plugin";
import { UserCancelledError } from "../navigation/resolver";
import { FrameRateCounts } from "../tracking/framerate-counts";
import { Tracker } from "../tracking/tracker";
import { TrackingScreenDelegate } from "../tracking/tracking-screen-delegate";
import { Screen } from "../ui/screen";

export class MetricsGamePlugin extends GamePlugin {
    static readonly key = "metrics";
    readonly key = MetricsGamePlugin.key;

    private framerateCounts: FrameRateCounts;

    constructor(readonly tracker: Tracker) {
        super();
    }

    setup(): void {
        super.setup();

        this.framerateCounts = new FrameRateCounts(
            this.game.performanceRecorder,
        );

        window.addEventListener(
            "error",
            (event) => {
                this.tracker.track("errorOccurred", {
                    errorType: "error",
                    message: event.message,
                    lineno: event.lineno,
                });
                return false;
            },
            false,
        );
        window.addEventListener(
            "unhandledrejection",
            (err) => {
                if (err.reason instanceof UserCancelledError) {
                    return;
                }

                this.tracker.track("errorOccurred", {
                    errorType: "unhandledrejection",
                    message: err.reason.message,
                });
                return false;
            },
            false,
        );

        this.tracker.track("gameSetup", {});
    }

    cycle(elapsed: number): void {
        super.cycle(elapsed);
        this.framerateCounts.cycle(elapsed);
    }

    setupScreen(screen: Screen): void {
        super.setupScreen(screen);
        screen.delegate = new TrackingScreenDelegate(screen, this.tracker);
    }
}
