import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import { Modal } from "@mui/material";
import { ReactState } from "../definitions";

export interface ModalProps {
  className?: string;
  anchorClassName?: string;
  anchorContent?: React.ReactNode,
  children: React.ReactNode,
  state?: ReactState<boolean>
}

export const FixedModal: React.FC<ModalProps> = ({
  className,
  anchorClassName,
  anchorContent,
  children,
  state: [open, setOpen] = React.useState(false),
}) => {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className={anchorClassName} onClick={handleOpen}>
        {anchorContent}
      </div>
      <Modal
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            // backdropFilter: "blur(2px)",
          },
        }}
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
      >
        <div className={`${className}`}>{children}</div>
      </Modal>
    </>
  );
}
