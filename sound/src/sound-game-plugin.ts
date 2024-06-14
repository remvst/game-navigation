import { GamePlugin } from "@remvst/game-navigation-core";
import { SongMapping, SoundtrackManager } from "./soundtrack-manager";

export type HowlAndSprite = [Howl, string | undefined];
export type HowlOrHowlAndSprite = Howl | HowlAndSprite;

export class SoundGamePlugin extends GamePlugin {
    static readonly key = "sound";
    readonly key = SoundGamePlugin.key;

    private muted = false;
    private masterVolume: number = 1;
    private effectsVolume: number = 1;

    readonly soundtrack = new SoundtrackManager(this.songMapping);

    onReadyToPlayAudio = () => {};
    isReadyToPlayAudio = false;

    constructor(private readonly songMapping: SongMapping = new Map()) {
        super();
    }

    watchHowls(howls: Howl[]) {
        if (this.isReadyToPlayAudio) return;

        for (const howl of howls) {
            howl.once("play", () => this.onAnySoundPlaying());
        }
    }

    private onAnySoundPlaying() {
        if (this.isReadyToPlayAudio) return;
        this.isReadyToPlayAudio = true;
        this.onReadyToPlayAudio();
    }

    setMuted(muted: boolean) {
        this.muted = muted;
        this.onVolumeUpdated();
    }

    playSoundEffect(sound: HowlOrHowlAndSprite, relativeVolume: number = 1) {
        const howl = sound instanceof Howl ? sound : sound[0];
        const sprite = sound instanceof Howl ? undefined : sound[1];

        howl.volume(this.effectsVolume * relativeVolume);

        if (!this.isReadyToPlayAudio) {
            howl.once("play", () => this.onAnySoundPlaying());
        }

        return howl.play(sprite || undefined);
    }

    setMasterVolume(volume: number) {
        this.masterVolume = volume;
        this.onVolumeUpdated();
    }

    setEffectsVolume(volume: number) {
        this.effectsVolume = volume;
        this.onVolumeUpdated();
    }

    private onVolumeUpdated() {
        Howler.volume(this.masterVolume);
        Howler.mute(this.muted);
    }

    addDebugValues(values: { [key: string]: any }): void {
        super.addDebugValues(values);
        values["sound.muted"] = this.muted;
        values["sound.isReadyToPlayAudio"] = this.isReadyToPlayAudio;
        values["sound.soundtrack.currentType"] = this.soundtrack.currentType;
    }
}
