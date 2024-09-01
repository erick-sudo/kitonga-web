import { useState } from "react";
import { ManualModal } from "../../ui/modals/ManualModal";
import { Alert } from "@mui/material";
import { DeleteResponse } from "../../ui/definitions";

export default function DeleteModal({
  anchorClassName,
  anchorContent,
  passKey,
  onSubmit,
  children,
}: {
  passKey: string;
  anchorClassName?: string;
  anchorContent?: React.ReactNode;
  children?: React.ReactNode;
  onSubmit: () => Promise<DeleteResponse>;
}) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [res, setRes] = useState<DeleteResponse | null>(null);
  return (
    <ManualModal
      contentClassName="w-max mx-auto"
      state={[openDeleteModal, setOpenDeleteModal]}
      anchorClassName={anchorClassName}
      anchorContent={anchorContent}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDeleting(true);
          onSubmit()
            .then((res) => {
              setRes(res);
            })
            .finally(() => {
              setDeleting(false);
            });
        }}
        className="grid gap-2"
      >
        {children}

        {res && (
          <div className="shadow rounded">
            <Alert severity={res.status}>
              <div className=" break-all">{res.message}</div>
            </Alert>
          </div>
        )}

        <div className="">
          <h3>
            Type &apos;<span className="font-semibold text-red-800">{passKey}</span>
            &apos; below to confirm.
          </h3>
          <div className="flex p-1 border rounded">
            <input
              className="flex-grow outline-none px-4 py-1"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button
              className="disabled:bg-gray-300 w-48 disabled:cursor-not-allowed px-4 py-1 bg-red-800 text-white rounded"
              disabled={deleting || confirm !== passKey}
              type="submit"
            >
              {deleting ? "Deleting..." : "Confirm"}
            </button>
          </div>
        </div>
      </form>
    </ManualModal>
  );
}
