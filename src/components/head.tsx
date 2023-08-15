import { useEffect, useState } from "react";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import { useStore } from "@nanostores/react";
import { $content } from "../stores/search";

const SearchBar = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}) => {
  const [page, setPage] = useState<"root" | "projects">("root");
  const [search, setSearch] = useState("");
  const contentStore = useStore($content);
  // const filteredItems = filterItems(
  //   contentStore.map((content) => ({
  //     id: content.title,
  //     title: content.content.title,
  //     description: content.content.description,
  //   })),
  //   search
  // );

  return (
    <CommandPalette
      onChangeSearch={setSearch}
      onChangeOpen={setOpen}
      search={search}
      isOpen={isOpen}
      page={page}
    >
      {/* <CommandPalette.Page id="root">
        {filteredItems.length ? (
          filteredItems.map((list) => (
            <CommandPalette.List key={list.id} heading={list.heading}>
              {list.items.map(({ id, ...rest }) => (
                <CommandPalette.ListItem
                  key={id}
                  index={getItemIndex(filteredItems, id)}
                  {...rest}
                />
              ))}
            </CommandPalette.List>
          ))
        ) : (
          <CommandPalette.FreeSearchAction />
        )}
      </CommandPalette.Page> */}
    </CommandPalette>
  );
};

export const Head = () => {
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
      <SearchBar isOpen={isOpen} setOpen={setIsOpen} />
    </div>
  );
};
