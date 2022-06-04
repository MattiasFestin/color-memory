import lodash from 'lodash';
import { colorMap } from './colorHelper';

/**
 * @deprecated DO NOT USE!
 * @param seed The RNG seed
 * @returns Array of all the 8 Colors "randomly" shuffled
 */
export const randomColorArray = (seed: number) => {
    return shuffle(colorMap, seed);
};

/**
 *
 * @param seed The RNG seed
 * @returns Array of all the 8 Colors pairs "randomly" shuffled
 */
export const randomPlayField = (seed: number) => {
  return shuffle(colorMap.concat(colorMap), seed);
}

//Taken from: https://github.com/lodash/lodash/blob/master/shuffle.js
// NOTE: Modified to be procedual with squirrle3_i31 instead of Math.random to be testable with a seed.
export const shuffle = <T>(array: T[], seed: number): T[]  => {
    const length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    let index = -1;
    const lastIndex = length - 1;
    const result = lodash.cloneDeep(array);
    let rand = squirrle3_f32_scaled(index, seed);
    while (++index < length) {
      rand = index + Math.floor(squirrle3_f32_scaled(index + rand, seed) * (lastIndex - index + 1));
      const value = result[rand];
      result[rand] = result[index];
      result[index] = value;
    }
    return result;
};

//Magic squirrle3 bit constants
const BIT_NOISE1 = 0xB5297A4D;
const BIT_NOISE2 = 0x68E31DA4;
const BIT_NOISE3 = 0x1B56C4E9;

/**
 *
 * @param position Current RNG state
 * @param seed The RNG seed
 * @returns number, int between 0 and 2147483647
 */
export const squirrle3_i31 = (position: number, seed: number): number => {
    let mangled = position;
    mangled *= BIT_NOISE1
    mangled += seed
    mangled ^= (mangled >> 8)
    mangled += BIT_NOISE2
    mangled ^= (mangled << 8)
    mangled *= BIT_NOISE3
    mangled ^= (mangled >> 8)
    return mangled;
};

/**
 *
 * @param position Current RNG state
 * @param seed The RNG seed
 * @returns number, float between 0 and 1;
 */
export const squirrle3_f32_scaled = (position: number, seed: number): number => {
    return squirrle3_i31(position, seed) / (2**31-1); //Max storleken
}