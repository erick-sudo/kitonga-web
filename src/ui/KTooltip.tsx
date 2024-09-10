import clsx from "clsx";
import { useRef } from "react";

export function KTooltip({
  tooltipContent,
  tooltipContainerClassName = "bg-white",
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
  tooltipContent?: React.ReactNode;
  tooltipContainerClassName?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      onMouseEnter={() => {
        if (containerRef.current) {
          const { x, y, width, height } =
            containerRef.current.getBoundingClientRect();
          const h = window.innerHeight;
          const w = window.innerWidth;
          if (w - x < width) {
            containerRef.current.style.setProperty("right", "8px");
          }
          if (h - y < height) {
            containerRef.current.style.setProperty("bottom", "8px");
          }
        }
      }}
      ref={wrapperRef}
      className={`${className} cursor-pointer group`}
    >
      {children}
      <div
        ref={containerRef}
        style={{ zIndex: 999 }}
        className={clsx(`absolute hidden group-hover:block duration-300`)}
      >
        <div className={`${tooltipContainerClassName}`}>{tooltipContent}</div>
      </div>
    </div>
  );
}
