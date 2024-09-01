import { useState } from "react";
import useSearch from "../hooks/useSearch";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
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
