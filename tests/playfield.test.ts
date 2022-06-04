import { CardStateEnum } from '../src/enums/CardStateEnum';
import { PlayField } from '../src/logic/PlayField';
import { awaitNextStoreValue } from './utils';

// Seed = 42 gives this playfield:
export const expectedColors = [
    "#646964", "#dcf5ff", "#55415f", "#508cd7",
    "#646964", "#d77355", "#64b964", "#64b964",
    "#508cd7", "#dcf5ff", "#e6c86e", "#000000",
    "#000000", "#e6c86e", "#55415f", "#d77355",
];


describe("PlayField", () => {
    describe('constructor()', () => {
        it("should generate a new 'random' playfied from the seed", async () => {
            const playfield = new PlayField(42);

            const colors = playfield.getCards().flat().map(x => x.getColor());

            expect(colors).toEqual(expectedColors);
        });
    });

    describe('reset()', () => {
        it("should generate a new 'random' playfied from the seed", async () => {
            const playfield = new PlayField(0);

            const beforeColors = playfield.getCards().flat().map(x => x.getColor());

            expect(beforeColors).not.toEqual(expectedColors);

            playfield.reset(42);

            const colors = playfield.getCards().flat().map(x => x.getColor());

            expect(colors).toEqual(expectedColors);
        });
    });

    describe("getCardByIndex()", () => {
        it("should return card index with correct index", async () => {
            const playfield = new PlayField(42);

            expect(playfield.getCardByIndex(0)).toEqual((playfield as any).playfield[0][0]);
            expect(playfield.getCardByIndex(5)).toEqual((playfield as any).playfield[1][1]);
            expect(playfield.getCardByIndex(8)).toEqual((playfield as any).playfield[2][0]);
            expect(playfield.getCardByIndex(15)).toEqual((playfield as any).playfield[3][3]);
        });

        it("should throw an error with invalid index", async () => {
            const playfield = new PlayField(42);

            expect(() => {
                playfield.getCardByIndex(-1);
            }).toThrow('Invalid index. Index < 0');

            expect(() => {
                playfield.getCardByIndex(16);
            }).toThrow('Invalid index. Index > 15');

            expect(() => {
                playfield.getCardByIndex(1.1);
            }).toThrow('Invalid index. Index is not an integer');
        });
    });

    describe('getPlayfield()', () => {
        it("should return the playfield", async () => {
            const playfield = new PlayField(42);

            expect(playfield.getCards()).toEqual((playfield as any).playfield);
        });
    });

    describe('stateStore', () => {
        it("should trigger when state chagnes on the cards on the playfield", async () => {
            const playfield = new PlayField(42);

            setTimeout(() => {
                playfield.getCardByIndex(0).state.set(CardStateEnum.Selected);
            }, 20);

            const states = await awaitNextStoreValue({store: playfield.stateStore, skipInitialValue: true});

            expect(states[0]).toEqual(CardStateEnum.Selected);

            for (let i = 1; i < 16; i++) {
                expect(states[i]).toEqual(CardStateEnum.Default);
            }
        });
    });
});