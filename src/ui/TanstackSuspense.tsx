import * as React from "react";
import { useQuery } from "@tanstack/react-query";

interface TanstackSuspenseProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  fallback?: React.ReactNode;
  RenderError?: React.FC<{ error: Error }>;
  RenderData: React.FC<{ data: T }>;
  defaultErrorClassName?: string;
}
export function TanstackSuspense<T>({
  queryKey,
  queryFn,
  fallback,
  RenderError,
  RenderData,
  defaultErrorClassName,
}: TanstackSuspenseProps<T>) {
  const { data, isPending, error, isError } = useQuery({
    queryKey,
    queryFn,
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
