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
    queryKey,
    className,
    searching,
    onSubmit,
  }: {
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
        placeholder="Search cases..."
      />
    </form>
  );
}

interface LazySearchProps<T> {
  zIndex?: number;
  className?: string;
  viewPortClassName?: string;
  childClassName?: string;
  placeholder?: string;
  fetchItems: (query: string) => Promise<T[]>;
  RenderItem: React.FC<{ q: string; item: T }>;
  receiveSelection?: (item: T) => void;
  children?: React.ReactNode;
}

export function LazySearch<T>({
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
    <div className={`relative h-12`}>
      <div
        style={{ zIndex: zIndex }}
        className={`${className} absolute overflow-hidden left-0 right-0 top-0 grip gap-4 py-2 px-2`}
      >
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex grow items-center">
            <span
              onClick={() => {
                setItems([]);
                setSearch("");
              }}
              className=" cursor-pointer text-gray-500 hover:text-teal-700 duration-300"
            >
              <BackspaceIcon height={20} />
            </span>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className={`peer text-teal-700 caret-teal-800 block w-full outline-none bg-transparent  py-1 px-2 text-sm outline-2 placeholder:text-gray-500`}
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

        <div className={`grid ${viewPortClassName}`}>
          {items.map((item, idx) => (
            <div
              onClick={() => {
                if (typeof receiveSelection === "function") {
                  receiveSelection(item);
                }
              }}
              className={`${idx === 0 && ""} cursor-pointer ${childClassName}`}
              key={idx}
            >
              <RenderItem item={item} q={search} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
