import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import { Modal } from "@mui/material";
import { ReactState } from "../definitions";

export interface ModalProps {
  containerClassName?: string;
  contentClassName?: string;
  viewPortClassName?: string;
  anchorClassName?: string;
  anchorContent?: React.ReactNode;
  children: React.ReactNode;
  state?: ReactState<boolean>;
}

export const FixedModal: React.FC<ModalProps> = ({
  containerClassName,
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
      {open && (
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
          <div style={{ zIndex: 99 }} className={`${containerClassName} fixed inset-0`}>
            {children}
          </div>
        </Modal>
      )}
    </>
  );
};
