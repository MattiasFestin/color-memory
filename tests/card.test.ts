import { CardStateEnum } from '../src/enums/CardStateEnum';
import { ColorEnum } from '../src/enums/ColorEnum';
import { Card } from '../src/logic/Card';
import { awaitNextStoreValue } from './utils';

describe("Card", () => {
    describe("getColor()", () => {
        it("should return color", async () => {
            const card = new Card(ColorEnum.Green, 1);

            expect(card.getColor()).toEqual(ColorEnum.Green.toString());
        });
    })

    describe("getIndex()", () => {
        it("should return index", async () => {
            const card = new Card(ColorEnum.Green, 1);

            expect(card.getIndex()).toEqual(1);
        });
    });

    describe("state", () => {
        it("should return index", async () => {
            const card = new Card(ColorEnum.Green, 1);

            setTimeout(() => {
                card.state.set(CardStateEnum.Locked);
            }, 10);

            const state = await awaitNextStoreValue({store: card.state, skipInitialValue: true});

            expect(state).toEqual(CardStateEnum.Locked);
        });
    });
});