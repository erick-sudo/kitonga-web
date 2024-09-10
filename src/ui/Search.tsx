import { useEffect, useState } from "react";
import useSearch from "../hooks/useSearch";
import {
  BackspaceIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { CircularProgress } from "@mui/material";

export function Search(
  {
    placeholder = "Search...",
    queryKey,
    className,
    searching,
    onSubmit,
  }: {
    placeholder?: string;
    queryKey?: string;
    className?: string;
    searching?: boolean;
    onSubmit: (v: string) => void;
  } = { onSubmit: () => {}, queryKey: "q" }
) {
  const { search, setSearch } = useSearch({
    queryKey,
  });
  const [v, setV] = useState(search);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSearch(v);
        onSubmit(v);
      }}
      className={`${className} flex flex-row-reverse`}
    >
      <button
        disabled={searching}
        className="peer bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed py-1 px-2 w-12 flex items-center justify-center text-white hover:bg-teal-600 duration-300"
      >
        {searching ? (
          <span>
            <CircularProgress size={14} color="inherit" />
          </span>
        ) : (
          <MagnifyingGlassCircleIcon height={20} />
        )}
      </button>
      <input
        value={v}
        onChange={(e) => {
          setV(String(e.target.value));
        }}
        className="w-full px-4 py-1 outline-none border focus:border-teal-800 peer-hover:focus:border-teal-600 rounded-l duration-300"
        placeholder={placeholder}
      />
    </form>
  );
}

interface LazySearchProps<T> {
  disabled?: boolean;
  showResults?: "above" | "below";
  containerClassName?: string;
  zIndex?: number;
  className?: string;
  viewPortClassName?: string;
  childClassName?: string;
  placeholder?: string;
  fetchItems: (query: string) => Promise<T[]>;
  RenderItem: React.FC<{ q: string; item: T; clearOnSelect: () => void }>;
  receiveSelection?: (item: T) => void;
  children?: React.ReactNode;
}

export function LazySearch<T>({
  disabled = false,
  showResults = "below",
  containerClassName = "h-12",
  zIndex,
  receiveSelection,
  viewPortClassName,
  childClassName,
  fetchItems,
  RenderItem,
  placeholder,
  className,
  children,
}: LazySearchProps<T>) {
  const [items, setItems] = useState<Array<T>>([]);
  const [search, setSearch] = useState<string>("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (search) {
      fetchItems(search)
        .then((res) => {
          setItems(res);
        })
        .finally(() => setSearching(false));
    } else {
      setItems([]);
    }
  }, [search, fetchItems]);

  return (
    <div className={`relative ${containerClassName}`}>
      <div
        style={{ zIndex: zIndex }}
        className={`py-1 px-2 ${className} absolute overflow-hidden left-0 right-0 top-0 flex ${
          showResults === "above" ? "flex-col-reverse" : " flex-col"
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex grow items-center">
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setItems([]);
                setSearch("");
              }}
              className="cursor-pointer disabled:cursor-not-allowed text-gray-500 hover:text-teal-700 duration-300"
            >
              <BackspaceIcon height={20} />
            </button>
            <input
              disabled={disabled}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className={`disabled:cursor-not-allowed peer text-teal-700 caret-teal-800 block w-full outline-none bg-transparent  py-1 px-2 text-sm outline-2 placeholder:text-gray-500`}
              placeholder={placeholder}
            />
            <div className="pr-2">
              {searching ? (
                <span>
                  <CircularProgress size={14} color="inherit" />
                </span>
              ) : (
                <MagnifyingGlassIcon height={20} />
              )}
            </div>
          </div>
          {children}
        </div>

        {items.length > 0 ? (
          <div className={`grid ${viewPortClassName}`}>
            {items.map((item, idx) => (
              <div
                onClick={() => {
                  if (typeof receiveSelection === "function") {
                    receiveSelection(item);
                  }
                }}
                className={`${
                  idx === 0 && ""
                } cursor-pointer ${childClassName}`}
                key={idx}
              >
                <RenderItem
                  item={item}
                  q={search}
                  clearOnSelect={() => {
                    setSearch("");
                    setItems([]);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            {!!search && <div className="p-2 border">No results found...</div>}
          </>
        )}
      </div>
    </div>
  );
}
