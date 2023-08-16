import { useEffect, useMemo, useState } from "react";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import { useStore } from "@nanostores/react";
import type { Content } from "../stores/search";
import Fuse from "fuse.js";

const SearchResults = ({
  title,
  description,
  match,
}: {
  title: string;
  description: string;
  match: Fuse.FuseResultMatch[];
}) => {
  const titleMatch = match.find((m) => m.key === "title");

  let firstPart = title;
  let highlightedPart = "";
  let secondPart = "";

  if (titleMatch) {
    firstPart = title.slice(0, titleMatch.indices[0][0]);
    highlightedPart = title.slice(
      titleMatch.indices[0][0],
      titleMatch.indices[0][1] + 1
    );
    secondPart = title.slice(titleMatch.indices[0][1] + 1);
  }
  const descriptionMatch = match.find((m) => m.key === "content.description");

  let descriptionFirstPart = description;
  let descriptionHighlightedPart = "";
  let descriptionSecondPart = "";
  if (descriptionMatch) {
    descriptionFirstPart = description.slice(
      0,
      descriptionMatch.indices[0][0] - 1
    );
    descriptionHighlightedPart = description.slice(
      descriptionMatch.indices[0][0] - 1,
      descriptionMatch.indices[0][1] + 1
    );
    descriptionSecondPart = description.slice(
      descriptionMatch.indices[0][1] + 1
    );
  }
  return (
    <div className="flex flex-col font-thin">
      <div className="text-lg">
        {firstPart}
        <span className="font-bold">{highlightedPart}</span>
        {secondPart}
      </div>
      <div className="text-sm">
        {descriptionFirstPart}
        <span className="font-bold">{descriptionHighlightedPart}</span>
        {descriptionSecondPart}
      </div>
    </div>
  );
};

const SearchBar = ({
  isOpen,
  setOpen,
  content,
}: {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  content: Content;
}) => {
  const [search, setSearch] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(content, {
        keys: ["content.description", "title", "tag"],
        threshold: 0.2,
        includeMatches: true,
      }),
    [content]
  );

  const searchResult = fuse.search(search);

  return (
    <CommandPalette
      onChangeSearch={setSearch}
      onChangeOpen={setOpen}
      search={search}
      isOpen={isOpen}
    >
      <CommandPalette.List>
        {searchResult.map(({ item, matches }, i) => (
          <CommandPalette.ListItem
            key={item.title}
            index={i}
            title={item.title}
            onClick={() => {
              window.open(item.content.url, "_blank");
            }}
            showType={false}
            children={
              <SearchResults
                title={item.title}
                description={item.desc}
                match={matches as Fuse.FuseResultMatch[]}
              />
            }
          />
        ))}
      </CommandPalette.List>
    </CommandPalette>
  );
};

export const Head = ({ content }: { content: Content }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="mx-auto">
      <div className="text-4xl font-bold text-center">Awesome Stack</div>
      <div className="text-center font-thin">
        list of awesome things to add to your stack curated with love by Thinc.
      </div>
      <div
        onClick={() => setIsOpen(true)}
        className="p-3 cursor-pointer z-50 w-full border bg-gray-800 border-white flex justify-between border-opacity-20 rounded-lg mt-10"
      >
        <div className="text-white font-thin">Find something awesome...</div>
        <div className="font-mono space-x-0.5">
          <p className="inline text-lg leading-none pt-0.5">⌘</p>
          <p className="inline leading-none">K</p>
        </div>
      </div>
      <SearchBar isOpen={isOpen} content={content} setOpen={setIsOpen} />
    </div>
  );
};
