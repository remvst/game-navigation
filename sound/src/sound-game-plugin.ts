import { GamePlugin } from "@remvst/game-navigation-core";
import { SongMapping, SoundtrackManager } from "./soundtrack-manager";

export class SoundGamePlugin extends GamePlugin {
    static readonly key = "sound";
    readonly key = SoundGamePlugin.key;

    private didPerformUserInteraction = false;

    private masterVolume: number = 1;
    private effectsVolume: number = 1;

    readonly soundtrack = new SoundtrackManager(this.songMapping);

    onReadyToPlayAudio = () => {};
    isReadyToPlayAudio = false;

    constructor(private readonly songMapping: SongMapping = new Map()) {
        super();

        const onEvt = this.onAnyUserInteraction.bind(this);
        for (const event of ["keydown", "keyup"]) {
            window.addEventListener(event, onEvt, false);
        }
        for (const event of [
            "mousedown",
            "mouseup",
            "contextmenu",
            "touchstart",
        ]) {
            document.body.addEventListener(event, onEvt, false);
        }
    }

    private onAnyUserInteraction() {
        if (this.didPerformUserInteraction) return;

        this.didPerformUserInteraction = true;
        this.isReadyToPlayAudio = true;
        this.onReadyToPlayAudio();
    }

    setMuted(muted: boolean) {
        Howler.mute(muted);
    }

    playSoundEffect(howl: Howl, relativeVolume: number = 1) {
        howl.volume(this.effectsVolume * relativeVolume);
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
