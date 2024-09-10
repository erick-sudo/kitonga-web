import { CSSProperties } from "react";
import { RequestError, RequestResult } from "../hooks/useAPI";

export interface DisplayObjectProps {
  value: any;
  indent?: number;
  style?: CSSProperties | undefined;
  className?: string;
  indentProperty?: string;
  entryClassName?: string;
}

export function DisplayObject({
  value,
  indent = 0,
  style,
  className,
  entryClassName,
  indentProperty = "paddingLeft",
}: DisplayObjectProps) {
  const flatTypes = [
    "string",
    "number",
    "undefined",
    "symbol",
    "boolean",
    "bigint",
  ];

  return (
    <div
      style={{ ...style, [indentProperty]: `${indent}px` }}
      className={`${className}`}
    >
      {flatTypes.includes(typeof value)
        ? value
        : Array.isArray(value)
        ? value.map((el, index) => (
            <DisplayObject key={index} value={el} indent={indent} />
          ))
        : typeof value === "function"
        ? "function"
        : typeof value === "object"
        ? Object.entries(value).map(([k, v], index) => (
            <div className={`${entryClassName}`} key={index}>
              <div>{k}</div>
              <DisplayObject key={index} value={v} indent={indent} />
            </div>
          ))
        : ""}
    </div>
  );
}

export function RequestErrorsWrapperNode({
  requestError,
  displayObjectProps,
  fallbackMessage = "An error occured while processing our request.",
}: {
  requestError: RequestResult<any>;
  displayObjectProps?: Omit<DisplayObjectProps, "value">;
  fallbackMessage?: string;
}) {
  return (
    <>
      <span className="text-xs">{requestError.errors.status}</span>
      <DisplayObject
        {...displayObjectProps}
        value={
          requestError.errors.errors ||
          requestError.errors.error ||
          fallbackMessage
        }
      />
    </>
  );
}
