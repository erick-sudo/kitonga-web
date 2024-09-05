import React, { useState } from "react";
import { ReactState } from "../definitions";
import { Drawer } from "@mui/material";
import clsx from "clsx";

export default function KDrawer({
  anchorPosition = "left",
  anchorClassName,
  anchorContent,
  collapseClassName,
  collapseContent,
  viewPortClassName,
  state: [open, setOpen] = useState(false),
  children,
}: {
  anchorPosition?: "top" | "left" | "bottom" | "right";
  anchorClassName?: string;
  anchorContent?: React.ReactNode;
  collapseClassName?: string;
  collapseContent?: React.ReactNode;
  viewPortClassName?: string;
  children: React.ReactNode;
  state?: ReactState<boolean>;
}) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div className={`${anchorClassName} cursor-pointer`} onClick={handleOpen}>
        {anchorContent}
      </div>
      <Drawer
        PaperProps={{
          className: "vertical-scrollbar",
          sx: {
            backgroundColor: "rgb(243 244 246)",
            display: "flex",
          },
        }}
        anchor={anchorPosition}
        open={open}
      >
        <div
          className={clsx("flex flex-grow", {
            "flex-row-reverse": anchorPosition === "left",
            " _": anchorPosition === "right",
            "flex-col": anchorPosition === "bottom",
            "flex-col-reverse": anchorPosition === "top",
          })}
        >
          <div className="flex items-center justify-center">
            <button onClick={handleClose} className={`${collapseClassName}`}>
              {collapseContent}
            </button>
          </div>
          <div className={`${viewPortClassName} flex-grow`}>{children}</div>
        </div>
      </Drawer>
    </>
  );
}
