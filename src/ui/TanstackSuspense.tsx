import * as React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface CommonSuspenseProps<T> {
  keepPrevious?: boolean;
  queryKey: any[];
  fallback?: React.ReactNode;
  RenderError?: React.FC<{ error: Error }>;
  RenderData: React.FC<{ data: T }>;
  defaultErrorClassName?: string;
}

interface TanstackSuspenseFNProps<T> extends CommonSuspenseProps<T> {
  queryFn: () => Promise<T>;
}

interface TanstackSuspensePaginatedFNProps<T> extends CommonSuspenseProps<T> {
  queryFn: () => Promise<T>;
  RenderPaginationIndicators: React.FC<{
    currentPage: number;
  }>;
  currentPage: number;
}

export function TanstackSuspense<T>({
  keepPrevious,
  queryKey,
  queryFn,
  fallback,
  RenderError,
  RenderData,
  defaultErrorClassName,
}: TanstackSuspenseFNProps<T>) {
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
  currentPage,
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
        queryKey={[queryKey, currentPage].flat()}
        queryFn={queryFn}
        fallback={fallback}
        RenderError={RenderError}
        RenderData={RenderData}
        keepPrevious={true}
        defaultErrorClassName={defaultErrorClassName}
      />
      <RenderPaginationIndicators currentPage={currentPage} />
    </>
  );
}
