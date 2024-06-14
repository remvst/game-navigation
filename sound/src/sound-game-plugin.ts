import { GamePlugin } from "@remvst/game-navigation-core";
import { SongMapping, SoundtrackManager } from "./soundtrack-manager";

export type HowlAndSprite = [Howl, string | undefined];
export type HowlOrHowlAndSprite = Howl | HowlAndSprite;

export class SoundGamePlugin extends GamePlugin {
    static readonly key = "sound";
    readonly key = SoundGamePlugin.key;

    private masterVolume: number = 1;
    private effectsVolume: number = 1;

    readonly soundtrack = new SoundtrackManager(this.songMapping);

    onReadyToPlayAudio = () => {};
    isReadyToPlayAudio = false;

    constructor(private readonly songMapping: SongMapping = new Map()) {
        super();
    }

    private onAnySoundPlaying() {
        if (this.isReadyToPlayAudio) return;
        this.isReadyToPlayAudio = true;
        this.onReadyToPlayAudio();
    }

    setMuted(muted: boolean) {
        Howler.mute(muted);
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
    }
}
