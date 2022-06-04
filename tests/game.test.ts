import lodash from 'lodash';
import { CardStateEnum } from '../src/enums/CardStateEnum';
import { ColorEnum } from '../src/enums/ColorEnum';
import { Game } from '../src/logic/Game';
import type { Sound } from '../src/logic/Sound';
import { awaitNextStoreValue } from './utils';

import { expectedColors } from './playfield.test';

const gameToColorArray = (game: Game) => {
	const cards = lodash.flatten(game.getPlayfield()?.getCards());

	return cards.map(c => c.getColor());
}

describe("Game", () => {
	describe("reset()", () => {
		it("should initilize a new random playfield from the seed", async () => {
			const game = new Game(0);

			expect(gameToColorArray(game)).not.toEqual(expectedColors);

			game.reset(42);

			expect(gameToColorArray(game)).toEqual(expectedColors);

		});
	});

	//NOTE: howlerjs sound library needs browser api:s to load resources
	//FIXME: Add shim or use browser based test
	// describe("load()", () => {
	// 	it("should load resources", async () => {
	// 		const game = new Game(0);

	// 		const sound: Sound = (game as any).sound;

	// 		expect((sound as any).successSnd).toBeNull();
	// 		expect((sound as any).failSnd).toBeNull();

	// 		await game.load();

	// 		expect((sound as any).successSnd).not.toBeNull();
	// 		expect((sound as any).failSnd).not.toBeNull();
	// 	});
	// });

	describe("score()", () => {
		it("should be zero initially", async () => {
			const game = new Game(42);

			const score = await awaitNextStoreValue({store: game.score, skipInitialValue: false});
			expect(score).toEqual(0);
		});
	});

	describe("gameLogic()", () => {
		it("decrement score when selecting two diffrent color cards", async () => {
			const game = new Game(42);

			const cards = game.getPlayfield()?.getCards() || [];
			const flattenCards = cards.flat();

			const selected1 = cards[0][0];
			const selected2 = cards[0][2];

			setTimeout(() => {
				try {
					expect(selected1.getColor()).not.toEqual(selected2.getColor());
					selected1.state.set(CardStateEnum.Selected);
					selected2.state.set(CardStateEnum.Selected);
				} catch (e) {
					throw e;
				}
			}, 10);

			const score = await awaitNextStoreValue({store: game.score, skipInitialValue: true});
			expect(score).toEqual(-1);

			//Check so the cards are locked after
			const cardStates = await Promise.all(flattenCards
				.filter(x => x !== selected1 && x !== selected2)
				.map(x => awaitNextStoreValue({store: x.state, skipInitialValue: false}))
			);
			expect(cardStates.every(x => x === CardStateEnum.Locked)).toEqual(true);
		});

		it("increment score when selecting two same color cards", async () => {
			const game = new Game(42);

			const cards = game.getPlayfield()?.getCards() || [];
			const flattenCards = cards.flat();

			const selected1 = cards[0][0];
			const selected2 = cards[1][0];

			setTimeout(() => {
				try {
					expect(selected1.getColor()).toEqual(selected2.getColor());
					selected1.state.set(CardStateEnum.Selected);
					selected2.state.set(CardStateEnum.Selected);
				} catch (e) {
					throw e;
				}
			}, 10);

			const score = await awaitNextStoreValue({store: game.score, skipInitialValue: true});
			expect(score).toEqual(1);

			//Check so the cards are locked after
			const cardStates = await Promise.all(flattenCards
				.filter(x => x !== selected1 && x !== selected2)
				.map(x => awaitNextStoreValue({store: x.state, skipInitialValue: false}))
			);
			expect(cardStates.every(x => x === CardStateEnum.Locked)).toEqual(true);
		});

		it("should have the default state of the cards to be Default", async () => {
			const game = new Game(42);

			const cards = game.getPlayfield()?.getCards() || [];
			const flattenCards = cards.flat();

			const previousCardStates = await Promise.all(flattenCards
				.map(x => awaitNextStoreValue({store: x.state, skipInitialValue: false}))
			);

			expect(previousCardStates.every(x => x === CardStateEnum.Default)).toEqual(true);
		});

		//TODO: More test and better coverage
	});
});