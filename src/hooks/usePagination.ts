import { useSearchParams } from "react-router-dom";

export default function usePagination({
  initialPage = 1,
  initialPageSize = 10,
} = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const setNextPage = (newPage: number) => {
    searchParams.set("page", `${newPage || 1}`);
    setSearchParams(searchParams);
  };

  const setNumberOfItemsPerPage = (newSize: number) => {
    searchParams.set("size", `${newSize || 1}`);
    setSearchParams(searchParams);
  };

  return {
    setNextPage,
    setNumberOfItemsPerPage,
    currentPage: Number(searchParams.get("page")) || initialPage || 1,
    itemsPerPage: Number(searchParams.get("size")) || initialPageSize || 1,
  };
}
