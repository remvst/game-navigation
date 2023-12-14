import { GamePlugin } from "@remvst/game-navigation-core";
import { SongMapping, SoundtrackManager } from "./soundtrack-manager";

export class SoundGamePlugin extends GamePlugin {

    static readonly key = 'sound';
    readonly key = SoundGamePlugin.key;

    private masterVolume: number = 1;
    private effectsVolume: number = 1;

    readonly soundtrack = new SoundtrackManager(this.songMapping);

    constructor(private readonly songMapping: SongMapping = new Map()) {
        super();
    }

    setMuted(muted: boolean) {
        Howler.mute(muted);
    }

    playSoundEffect(howl: Howl, relativeVolume: number = 1) {
        howl.volume(this.effectsVolume * this.masterVolume * relativeVolume);
        return howl.play();
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
