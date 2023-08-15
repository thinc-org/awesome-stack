import { atom } from "nanostores";

export const $search = atom<string>("");

export const $searchResults = atom<string[]>([]);

export type Content = {
  content: {
    description: string;
    image: string;
    url: string;
  };
  by: string;
  title: string;
  tag: string[];
}[];

export const $content = atom<Content>([]);

export const setSearch = (value: string) => {
  $search.set(value);
};

export const setSearchResults = (value: Content) => {
  $content.set(value);
};
