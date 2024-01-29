import { PerformanceRecorder } from "@remvst/client-performance";
import { Properties } from "./tracker";

export class FrameRateCounts {
    private readonly counts = {
        above60: 0,
        above45: 0,
        above30: 0,
        above15: 0,
        above0: 0,
    };

    private age = 0;

    constructor(private readonly performanceRecorder: PerformanceRecorder) {}

    cycle(elapsed: number) {
        this.age += elapsed;

        if (this.age > 0.5) {
            const previousFrame = this.performanceRecorder.frame(
                this.performanceRecorder.frameCount - 1,
            );
            const currentFrame = this.performanceRecorder.frame(
                this.performanceRecorder.frameCount,
            );
            const framerate =
                1000 /
                (currentFrame.onStartTimes.get("FRAME") -
                    previousFrame.onStartTimes.get("FRAME"));
            let key: keyof typeof this.counts;
            if (framerate > 60) {
                key = "above60";
            } else if (framerate > 45) {
                key = "above45";
            } else if (framerate > 30) {
                key = "above30";
            } else if (framerate > 15) {
                key = "above15";
            } else {
                key = "above0";
            }
            this.counts[key]++;
        }
    }

    toJson(): Properties {
        return this.counts;
    }
}
