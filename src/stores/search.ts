import { atom } from "nanostores";

export const $search = atom<string>("");

export const $searchResults = atom<string[]>([]);

export const setSearch = (value: string) => {
  $search.set(value);
};
