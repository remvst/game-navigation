export interface GameParams {
    width: number;
    height: number;
    debug: boolean;
    automation: boolean;
    showBounds: boolean;
    maxFrameInterval: number;
    resolution: number;
    fps?: number;
    timeKeys: boolean;
    pauseOnWindowBlur: boolean;
    zoomDifference: number;
};
