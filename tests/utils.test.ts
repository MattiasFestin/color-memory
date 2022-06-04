import { writable } from 'svelte/store';

import { awaitNextStoreValue } from './utils';

describe("Test Utils", () => {
    describe("awaitNextStoreValue", () => {
        it("should next state change of svelte store", async () => {
            const store = writable(0);

            setTimeout(() => {
                store.set(1);
            }, 10);

            const value = await awaitNextStoreValue({store, skipInitialValue: true});

            expect(value).toBe(1);
        });
    })
});