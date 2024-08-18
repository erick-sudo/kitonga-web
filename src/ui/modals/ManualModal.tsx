import * as React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FixedModal, ModalProps } from "./FixedModal";

export const ManualModal: React.FC<ModalProps> = ({
  anchorClassName,
  anchorContent,
  children,
  state: [open, setOpen] = React.useState(false),
}) => {
  return (
    <>
      <FixedModal
        state={[open, setOpen]}
        className=""
        anchorClassName={anchorClassName}
        anchorContent={anchorContent}
      >
        <div className="fixed inset-0" style={{ zIndex: 70 }}>
          <div className="max-w-xl mx-auto p-4 grid gap-4">
            <div className="flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border p-1 shadow-sm shadow-black hover:shadow-md hover:shadow-black hover:scale-105 duration-300 bg-white"
              >
                <XMarkIcon height={20} />
              </button>
            </div>
            <div className="bg-white shadow p-4 rounded-md">{children}</div>
          </div>
        </div>
      </FixedModal>
    </>
  );
}