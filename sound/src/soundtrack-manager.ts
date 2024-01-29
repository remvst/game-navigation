import { Howl } from "howler";

export type SongMapping = Map<string, Howl[]>;

export class SoundtrackManager {
    volume = 1;
    contextVolume = 1;
    currentHowl: Howl | null = null;
    currentHowlId: number | null = null;
    currentSoundIndex = Math.floor(Math.random() * 3);
    currentType: string = null;

    constructor(private readonly songMapping: SongMapping) {}

    setVolume(volume: number) {
        this.volume = volume;
        this.updateVolume();
    }

    setContextVolume(contextVolume: number) {
        this.contextVolume = contextVolume;
        this.updateVolume();
    }

    private updateVolume() {
        if (this.currentHowl) {
            this.currentHowl.volume(this.howlVolume);
        }
    }

    private get howlVolume() {
        return this.volume * this.contextVolume;
    }

    start(type: string) {
        if (this.currentType === type) {
            return;
        }

        this.currentType = type;
        this.next();
    }

    next() {
        const { currentHowl, currentHowlId } = this;
        if (currentHowl && currentHowlId) {
            currentHowl.once("fade", () => currentHowl.stop(currentHowlId));
            currentHowl.fade(this.howlVolume, 0, 1000, currentHowlId);
        }

        this.currentHowl = null;
        this.currentHowlId = null;

        this.currentSoundIndex++;

        let songs: Howl[] = this.songMapping.get(this.currentType);
        if (!songs || !songs.length) return;

        const { currentType } = this;
        const howl = songs[this.currentSoundIndex % songs.length];
        howl.volume(this.howlVolume);

        const howlId = howl.play();
        howl.once("end", () => {
            this.currentHowl?.stop(this.currentHowlId);
            this.next();
        });

        this.currentHowl = howl;
        this.currentHowlId = howlId;

        this.currentHowl.once(
            "play",
            () => {
                if (this.currentType !== currentType) {
                    howl.stop(howlId);
                }
            },
            howlId,
        );
    }

    fadeIn() {
        const { currentHowl, currentHowlId } = this;
        if (currentHowl && currentHowlId) {
            this.currentHowl?.fade(0, this.volume, 1000, this.currentHowlId);
        }
    }
}
