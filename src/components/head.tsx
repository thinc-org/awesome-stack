import { useEffect, useMemo, useState } from "react";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import { useStore } from "@nanostores/react";
import type { Content } from "../stores/search";
import Fuse from "fuse.js";

const SearchResults = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col">
      <div className="text-lg font-bold">{title}</div>
      <div className="text-sm">{description}</div>
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
  const [page, setPage] = useState<"root" | "projects">("root");
  const [search, setSearch] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(content, {
        keys: ["title", "tag", "content.description"],
        threshold: 0.3,
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
      page={page}
    >
      <CommandPalette.List>
        {searchResult.map(({ item }, i) => (
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
                description={item.content.description}
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
