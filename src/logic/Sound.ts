import {Howl, Howler} from 'howler';

import { SoundEffectEnum } from "../enums/SoundEffectEnum";

export class Sound {
    //TODO: Better resource managment
    private successSnd: Howl | null = null;
    private failSnd: Howl | null = null;
    private winSnd: Howl | null = null;

    constructor() {
        //NOTE: Lower the global volume to 5%, because of bleeding ears...
        Howler.volume(0.05);
    }

    /**
     * Loads the sound resources in parallel and awaits for all of them
     */
    async load() {
        await Promise.all([
            new Promise(resolve => {
                this.successSnd = new Howl({
                    preload: true,
                    src: ['448274__henryrichard__sfx-success.wav'],
                    format: ['wav']
                });

                this.successSnd.once('load', resolve)
            }),

            new Promise(resolve => {
                this.failSnd = new Howl({
                    preload: true,
                    src: ['361255__japanyoshithegamer__8-bit-uh-oh-sound.wav'],
                    format: ['wav']
                });

                this.failSnd.once('load', resolve)
            }),

            new Promise(resolve => {
                this.winSnd = new Howl({
                    preload: true,
                    src: ['518305__mrthenoronha__stage-clear-8-bit.wav'],
                    format: ['wav']
                });

                this.winSnd.once('load', resolve)
            })
        ]);
    }

    //TODO: Refactoring of resouce handling
    /**
     * Playes the howler sound object/resource with the provided type enum
     * @param type SoundEffectEnum, the sound to be played
     */
    play(type: SoundEffectEnum) {
        //Stop all previous sounds
        if (this.failSnd?.playing) {
            this.failSnd?.stop();
        }
        if (this.successSnd?.playing) {
            this.successSnd?.stop();
        }
        if (this.winSnd?.playing) {
            this.winSnd?.stop();
        }

        switch (type) {
            case SoundEffectEnum.Failure:
                this.failSnd?.play();
                break;

            case SoundEffectEnum.Sucess:
                this.successSnd?.play();
                break;

            case SoundEffectEnum.Win:
                this.winSnd?.play();
                break;
        }
    }
}