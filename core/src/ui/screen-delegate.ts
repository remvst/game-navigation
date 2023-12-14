export interface ScreenDelegate {
    onSetup(): void;
    onForeground(): void;
    onBackground(): void;
    onDestroy(): void;
}