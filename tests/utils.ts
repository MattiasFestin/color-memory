import type { Readable, Writable, Unsubscriber } from 'svelte/store';

interface IAwaitNextStoreValueParams<T> {
    store: Readable<T> | Writable<T>;
    skipInitialValue?: boolean
}
export const awaitNextStoreValue = <T>({store, skipInitialValue = true}: IAwaitNextStoreValueParams<T>): Promise<T> => {
    return new Promise(resolve => {
        let unsubscibe: Unsubscriber;
        let isNotFirst = false;

        unsubscibe = store.subscribe(value => {
            if (isNotFirst || !skipInitialValue) {
                //Skip first initial value from subscribe if flag is set
                resolve(value);

                if (unsubscibe) {
                    unsubscibe();
                }
            }
            isNotFirst = true;
        });
    });
};