import type { ColorEnum } from '../enums/ColorEnum';
import { CardStateEnum } from '../enums/CardStateEnum';

import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export class Card {
    private color: ColorEnum;
    private index: number;

    public state: Writable<CardStateEnum> = writable(CardStateEnum.Default);

    /**
     * @param color ColorEnum, the color of the card
     * @param index number, the index of the card in the playfield
     */
    constructor(color: ColorEnum, index: number) {
        this.color = color;
        this.index = index;
    }

    /**
     * @returns String, hex color of the cards color
     */
    getColor(): string {
        return this.color.toString();
    }

    /**
     * @returns The index of the card in the playfield
     */
    getIndex(): number {
        return this.index;
    }
}