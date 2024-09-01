import { useSearchParams } from "react-router-dom";

export default function useSearch({ queryKey = "q" } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const setSearch = (newValue: string) => {
    searchParams.set(queryKey, newValue);
    setSearchParams(searchParams);
  };

  return {
    setSearch,
    search: searchParams.get(queryKey) || "",
  };
}
