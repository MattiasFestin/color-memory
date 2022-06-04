import { type Readable, derived } from "svelte/store";
import lodash from 'lodash';

import { Card } from "./Card";
import { randomPlayField } from '../utils/randHelper';

import type { CardStateEnum } from "../enums/CardStateEnum";

export class PlayField {
	private playfield: Card[][] = [];

	public stateStore: Readable<CardStateEnum[]> = null as any;

	/**
	 * @param seed The RNG seed
	 */
	constructor(seed: number) {
		this.reset(seed);
	}

	/**
	 *
	 * @returns PlayField
	 */
	getCards() {
		return this.playfield;
	}

	/**
	 *
	 * @param index The index of the card in the playfield. Starts at the top right.
	 * @returns Card
	 */
	getCardByIndex(index: number): Card {
		if (index < 0) {
			throw new Error('Invalid index. Index < 0');
		}
		if (index > 15) {
			throw new Error('Invalid index. Index > 15');
		}
		if (index !== (index|0)) {
			throw new Error('Invalid index. Index is not an integer');
		}
		let yIndex = Math.floor(index / 4);
		let xIndex = index % 4;

		return this.playfield[yIndex][xIndex];
	}

	/**
	 * Reset the playfield to a new game
	 * @param seed The RNG seed
	 */
	reset(seed: number) {
		const colors = randomPlayField(seed);
		const cards = colors.map((color, index) => new Card(color, index));

		this.playfield = lodash.chunk(cards, 4);

		this.stateStore = derived(cards.map(c => c.state), lodash.debounce($state => {
			return $state;
		}, 10), []);
	}
}