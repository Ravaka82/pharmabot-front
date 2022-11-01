import {EntriesSearch} from "./search";

const hexToRgb = (hex: string): number[] => {
  // @ts-ignore
  return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
    ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))
}

export const getTextColor = (color: string) => {
  const rgba: any[] = hexToRgb(color) || [];
  if ((rgba[0] * 0.299) + (rgba[1] * 0.587) + (rgba[2] * 0.114) > 186) {
    return 'text-dark';
  } else {
    return 'text-white';
  }
}

export const generateViewPassword = (character: string, word: string) => {
  return new Array(word.length).fill(character).join('');
}

export const GET_ITEM_STORAGE = (name: string) => {
  const item = localStorage.getItem(name);
  return item && JSON.parse(item);
};
export const SET_ITEM_STORAGE = (name: string, value: any) => localStorage.setItem(name, JSON.stringify(value));
export const CLEAR_ITEM_STORAGE = () => localStorage.clear();
export const REMOVE_ITEM_STORAGE = (name: string) => localStorage.removeItem(name);

export {
  EntriesSearch,
}
