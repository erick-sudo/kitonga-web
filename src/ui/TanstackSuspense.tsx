import * as React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ReactState, ReactStateSetter } from "./definitions";

interface CommonSuspenseProps<T> {
  keepPrevious?: boolean;
  queryKey: (string | number)[];
  fallback?: React.ReactNode;
  RenderError?: React.FC<{ error: Error }>;
  RenderData: React.FC<{ data: T }>;
  defaultErrorClassName?: string;
}

interface TanstackSuspenseFNProps<T> extends CommonSuspenseProps<T> {
  queryFn: () => Promise<T>;
}

interface TanstackSuspensePaginatedFNProps<T> extends CommonSuspenseProps<T> {
  queryFn: (page: number) => Promise<T>;
  RenderPaginationIndicators: React.FC<{
    currentPage: number;
    setNextPage: ReactStateSetter<number>;
  }>;
  state?: ReactState<number>;
}

export function TanstackSuspense<T>({
  keepPrevious,
  queryKey,
  queryFn,
  fallback,
  RenderError,
  RenderData,
  defaultErrorClassName,
}: TanstackSuspenseFNProps<T> ) {
  const { data, isPending, error, isError } = useQuery({
    queryKey,
    queryFn,
    placeholderData: keepPrevious ? keepPreviousData : undefined,
  });

  if (isPending) return <>{fallback}</>;

  if (isError)
    return (
      <>
        {RenderError ? (
          <RenderError error={error} />
        ) : (
          <div className={`${defaultErrorClassName}`}>{error.message}</div>
        )}
      </>
    );

  return <RenderData data={data} />;
}

export function TanstackSuspensePaginated<T>({
  state: [page, setPage] = React.useState(0),
  queryKey,
  queryFn,
  fallback,
  RenderError,
  RenderData,
  RenderPaginationIndicators,
  defaultErrorClassName,
}: TanstackSuspensePaginatedFNProps<T>) {
  return (
    <>
      <TanstackSuspense
        queryKey={[queryKey, page].flat()}
        queryFn={async () => queryFn(page)}
        fallback={fallback}
        RenderError={RenderError}
        RenderData={RenderData}
        keepPrevious={true}
        defaultErrorClassName={defaultErrorClassName}
      />
      <RenderPaginationIndicators currentPage={page} setNextPage={setPage} />
    </>
  );
}
