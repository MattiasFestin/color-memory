import { derived, writable, type Readable, type Unsubscriber, type Writable } from "svelte/store";

import { PlayField } from "./PlayField";
import { CardStateEnum } from "../enums/CardStateEnum";
import type { ICardState } from "../interfaces/ICardState";

import { SoundEffectEnum } from "../enums/SoundEffectEnum";
import { Sound } from "./Sound";
import type { Card } from "./Card";

export class Game {
    private playfield: PlayField | null = null;
    private sound: Sound;
    private stateUnsubscriber: Unsubscriber | null = null;
    private finisedUnsubscriber: Unsubscriber | undefined;

    public finished: Readable<boolean> | null = null;
    public score: Writable<number> = writable(0);

    /**
     * @param seed The RNG seed
     */
    constructor(seed: number) {
        this.sound = new Sound();
        this.reset(seed);
    }

    /**
     * Awaits for the resources to load
     */
    async load() {
        await this.sound.load();
    }

    /**
     * Reset the game
     * @param seed The RNG seed
     */
    reset(seed: number) {
        if (this.stateUnsubscriber) {
            this.stateUnsubscriber();
        }

        if (this.finisedUnsubscriber) {
            this.finisedUnsubscriber();
        }

        if (!this.playfield) {
            this.playfield = new PlayField(seed);
        }


        this.playfield?.reset(seed);
        this.score.set(0);

        this.stateUnsubscriber = this.playfield.stateStore.subscribe(this.gameLogic.bind(this));
        this.registerFinishStore();
    }

    /**
     *
     * @returns Playfield
     */
    getPlayfield() {
        return this.playfield;
    }

    /**
     * Creates a derived svelte store from the playfields stateStore if it exists.
     */
    private registerFinishStore() {
        if (this.playfield?.stateStore) {
            this.finished = derived(this.playfield.stateStore, states => {
                let isWin = states && states.every(x => x === CardStateEnum.Removed);

                if (isWin) {
                    this.sound?.play(SoundEffectEnum.Win);
                }

                return isWin;
            });

            this.finisedUnsubscriber = this.finished?.subscribe(() => {});
        } else {
            console.error('this.playfield.stateStore does not exist');
        }
    }

    /**
     *
     * @param state An array card states of all the cards
     * @returns undefined
     */
    private gameLogic(state: CardStateEnum[]) {
        if (!state) {
            return;
        }

        const locked = this.filterMapState(state, CardStateEnum.Locked);
        const anyLocked = locked.length > 0;

        if (anyLocked) {
            //NOTE: Event has been triggered then change to cards to be locked.
            // To prevent dubble triggering the logic below we exit here.
            return;
        }

        const selected = this.filterMapState(state, CardStateEnum.Selected);

        if (selected.length > 2) {
            console.error('Invalid amount of selected cards');
            selected.forEach(c => c.card.state.set(CardStateEnum.Default));

            return;
        }

        if (selected.length === 2) {
            const selectedPair: [ICardState, ICardState] = [selected[0], selected[1]];
            const remaining = this.filterMapState(state, CardStateEnum.Default);

            this.checkCardPair(selectedPair, remaining);
        }
    }

    /**
     *
     * @param selectedPair [ICardState, ICardState] tuple of the cards that are selected
     * @param selected
     * @param remaining
     */
    private checkCardPair(selectedPair: [ICardState, ICardState], remaining: ICardState[]) {
        const [first, second] = selectedPair;

        if (first.card.getColor() === second.card.getColor()) {
            //A match! Then we increase the score and remove the cards from the game
            this.correctCards(remaining, selectedPair);
        } else {
            //Not a match, We decrement the score and flip back the cards
            this.wrongCards(remaining, selectedPair);
        }
    }


     /**
     * Filters the playfield cardstate array that has state provided and maps it to an ICardState array
     * @param playfieldStates Array of CardStateEnum of the current playfield state
     * @param state CardStateEnum to filter against
     * @returns array of ICardState
     */
      private filterMapState(playfieldStates: CardStateEnum[], state: CardStateEnum): ICardState[] {
        return playfieldStates
            .map((s,i) => {
                return {
                    card: this.playfield?.getCardByIndex(i),
                    state: s
                };
            })
            .filter(x => x.state === state);
    }

    /**
     * Lock the remaining cards for 2000ms.
     * @param remaining The cards left to play
     * @param selected The cards that are selected
     */
    private lockCards(remaining: ICardState[], selected: [ICardState, ICardState]) {
        remaining.forEach(c => c.card.state.set(CardStateEnum.Locked));

        setTimeout(() => {
            selected[0].card.state.set(CardStateEnum.Hidden);
            selected[1].card.state.set(CardStateEnum.Hidden);

            remaining.forEach(c => c.card.state.set(CardStateEnum.Default));
        }, 2000);
    }

    /**
     * Sets the selected cards as correct after 500ms, then as Removed afer 2000ms.
     * Calls the lockCards on the remaining cards
     *
     * Increments the score by one
     * @param remaining The cards left to play
     * @param selected The cards that are selected
     */
    private correctCards(remaining: ICardState[], selected: [ICardState, ICardState]) {
        this.lockCards(remaining, selected);

        setTimeout(() => {
            selected[0].card.state.set(CardStateEnum.Correct);
            selected[1].card.state.set(CardStateEnum.Correct);
        }, 500);

        setTimeout(() => {
            selected[0].card.state.set(CardStateEnum.Removed);
            selected[1].card.state.set(CardStateEnum.Removed);
        }, 2000);

        this.sound.play(SoundEffectEnum.Sucess);
        this.score.update(s => s + 1);
    }

    /**
     * Sets the selected cards as Default after 2000ms.
     * Calls the lockCards on the remaining cards
     *
     * Decrements the score by one
     * @param remaining
     * @param selected
     */
    private wrongCards(remaining: ICardState[], selected: [ICardState, ICardState]) {
        this.lockCards(remaining, selected);

        setTimeout(() => {
            selected[0].card.state.set(CardStateEnum.Default);
            selected[1].card.state.set(CardStateEnum.Default);
        }, 2000);

        this.sound.play(SoundEffectEnum.Failure);
        this.score.update(s => s - .5);
    }
}