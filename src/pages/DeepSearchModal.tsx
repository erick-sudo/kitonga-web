import { useState } from "react";
import { ReactState } from "../ui/definitions";
import { FixedModal } from "../ui/modals/FixedModal";
import { LazySearch } from "../ui/Search";
import useAPI from "../hooks/useAPI";
import { axiosGet } from "../lib/axiosLib";
import { APIS } from "../lib/apis";
import { insertQueryParams, joinArrays } from "../lib/utils";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

export function DeepSearchModal({
  anchorClassName,
  anchorContent,
  state: [open, setOpen] = useState(false),
}: {
  anchorClassName?: string;
  anchorContent?: React.ReactNode;
  state?: ReactState<boolean>;
}) {
  const handleClose = () => setOpen(false);
  const handleRequest = useAPI();
  const navigate = useNavigate();
  return (
    <FixedModal
      state={[open, setOpen]}
      anchorClassName={anchorClassName}
      anchorContent={anchorContent}
    >
      <div className="fixed inset-0 flex flex-col vertical-scrollbar">
        <div className="flex">
          <div onClick={handleClose} className="flex-grow"></div>
          <div className="flex-grow max-w-xl min-w-[24rem] pb-4">
            <LazySearch
              viewPortClassName="gap-2"
              placeholder="Search clients and cases..."
              className="border bg-gray-100 rounded mt-4 shadow"
              fetchItems={(q) =>
                handleRequest<{
                  cases: Record<string, string | number>[];
                  clients: Record<string, string | number>[];
                }>({
                  func: axiosGet,
                  args: [insertQueryParams(APIS.dash.deepSearch, { q })],
                }).then((data) => {
                  if (data.status === "ok" && data.result) {
                    return [
                      ...data.result.cases,
                      ...data.result.clients,
                    ].flat();
                  }
                  return [];
                })
              }
              RenderItem={({ q, item }) => (
                <fieldset
                  onClick={() => {
                    navigate(
                      `/dashboard/${
                        item.entity === "Case" ? "cases" : "clients"
                      }/details/${item.id}`
                    );
                    handleClose();
                  }}
                  className={`group bg-white hover:bg-teal-800 text-gray-600 hover:text-gray-100 duration-300 py-2 px-4 rounded border shadow ${
                    item.entity === "Case"
                      ? "border-teal-800/50"
                      : "border-black/50"
                  }`}
                >
                  <legend
                    className={`mr-2 text-sm lowercase bg-white group-hover:bg-teal-800 px-2 rounded-full border ${
                      item.entity === "Case"
                        ? "border-teal-800/50 group-hover:border-black/50"
                        : "border-black/50"
                    }`}
                  >
                    {item.entity}
                  </legend>
                  {Object.entries(item)
                    .filter(([k]) => k !== "entity")
                    .filter(([, v]) => new RegExp(q, "i").test(String(v)))
                    .map(([k, v], index) => (
                      <div key={index} className="text mb-1">
                        <span
                          className={clsx(
                            "px-2 py-0.5 rounded-full text-sm font-semibold shadow-md border group-hover:border-teal-600/50"
                          )}
                        >
                          {String(k).replace(/_/g, " ")}
                        </span>
                        &nbsp;
                        <span className="">
                          {joinArrays(
                            String(v),
                            String(q),
                            "bg-black text-white"
                          )}
                        </span>
                      </div>
                    ))}
                </fieldset>
              )}
            />
          </div>
          <div onClick={handleClose} className="flex-grow"></div>
        </div>
        <div onClick={handleClose} className="flex-grow"></div>
      </div>
    </FixedModal>
  );
}
