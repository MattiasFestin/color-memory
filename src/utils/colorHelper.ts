import { ColorEnum } from "../enums/ColorEnum";

export const colorMap = [
    ColorEnum.Black,
    ColorEnum.Violete,
    ColorEnum.DarkGray,
    ColorEnum.Red,
    ColorEnum.Blue,
    ColorEnum.Green,
    ColorEnum.Yellow,
    ColorEnum.LightGray
];

export const NUMBER_OF_COLORS = colorMap.length;

/**
 *
 * @param color ColorEnum
 * @returns number, index of the color in the colorMap
 */
export const mapColorToNumber = (color: ColorEnum): number => {
    const index = colorMap.indexOf(color);
    if (index === -1) {
        throw new Error('Invalid color');
    }
    return index;
}

/**
 *
 * @param number The colorMap index
 * @returns ColorEnum
 */
export const mapNumberToColor = (number: number): ColorEnum => {
    if (number !== (number|0)) {
        throw new Error('Color index is not an integer');
    }
    if (number < 0 || number > colorMap.length) {
        throw new Error('Invalid color index');
    }
    return colorMap[number];
}