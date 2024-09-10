import { useContext, useState } from "react";
import useAPI from "../../hooks/useAPI";
import { useQueryClient } from "@tanstack/react-query";
import { ManualModal } from "../../ui/modals/ManualModal";
import { Add } from "@mui/icons-material";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import { Case, PolicyClient } from "../../lib/definitions";
import { axiosGet, axiosPost } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { InputFields } from "../../ui/modals/EditModal";
import { caseStates } from "../../lib/data";
import { Button } from "@mui/material";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { LoadingButton } from "@mui/lab";
import { insertQueryParams, joinArrays } from "../../lib/utils";
import { LazySearch } from "../../ui/Search";
import { BackspaceIcon } from "@heroicons/react/24/outline";
import { AlertContext } from "../Dashboard";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";

export function OpenNewCaseModal() {
  const handleRequest = useAPI();
  const queryClient = useQueryClient();
  const { pushAlert } = useContext(AlertContext);
  const [newCase, setNewCase] = useState<Record<string, string | number>>({
    client_id: "",
    title: "",
    description: "",
    case_no_or_parties: "",
  });
  const [selectedClient, setSelectedClient] = useState<PolicyClient | null>(
    null
  );
  const [creating, setCreating] = useState(false);
  const [openNewCaseModal, setOpenNewCaseModal] = useState(false);

  function handleCreateCase() {
    setCreating(true);
    handleRequest<Case>({
      func: axiosPost,
      args: [APIS.cases.postCase, newCase],
    })
      .then((res) => {
        if (res.status === "ok") {
          setOpenNewCaseModal(false);
          queryClient.invalidateQueries({
            queryKey: [TANSTACK_QUERY_KEYS.CASE_LIST],
          });
          pushAlert(
            {
              status: "success",
              message: "Case created successfully",
            },
            10000
          );
        } else {
          pushAlert(
            {
              status: "error",
              message: (
                <RequestErrorsWrapperNode
                  fallbackMessage="Could not create case!"
                  requestError={res}
                />
              ),
            },
            10000
          );
        }
      })
      .finally(() => {
        setCreating(false);
      });
  }
  return (
    <ManualModal
      state={[openNewCaseModal, setOpenNewCaseModal]}
      contentClassName="max-w-sm mx-auto"
      anchorClassName="flex items-center gap-2 text-white px-4 rounded text-sm py-1 bg-teal-800 w-max cursor-pointer hover:bg-teal-600 duration-300"
      anchorContent={
        <>
          <Add height={16} />
          <span className=" whitespace-nowrap">New Case</span>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateCase();
        }}
        className="grid gap-2"
      >
        <h3>Open new case</h3>
        <div className="grid">
          <div className="flex items-center justify-between border-t border-x bg-white rounded-t shadow">
            <div className="px-4 text-sm">
              {selectedClient ? selectedClient.name : "Select client"}
            </div>
            <span
              className="px-2 py-1"
              onClick={() => {
                setNewCase((p) => {
                  delete p["client_id"];
                  return p;
                });
                setSelectedClient(null);
              }}
            >
              <BackspaceIcon height={24} />
            </span>
          </div>

          <LazySearch
            containerClassName="h-10 flex-grow"
            zIndex={20}
            viewPortClassName="max-h-64 vertical-scrollbar"
            className="border bg-white w-full rounded-b shadow"
            fetchItems={(q: string) =>
              handleRequest<PolicyClient[]>({
                func: axiosGet,
                args: [insertQueryParams(APIS.clients.searchAllClients, { q })],
              }).then((res) => {
                if (res.status === "ok" && res.result) {
                  return res.result;
                }
                return [];
              })
            }
            RenderItem={({
              q,
              item: { id, name, username, email },
              clearOnSelect,
            }) => (
              <div
                onClick={() => {
                  setNewCase((p) => ({ ...p, client_id: id }));
                  setSelectedClient({
                    id,
                    name,
                    username,
                    email,
                  });
                  clearOnSelect();
                }}
                className="grid w-full text-start text-sm hover:bg-teal-600 hover:border-t-teal-600 hover:text-white px-4 py-1 duration-300 border-b"
              >
                <span>
                  <em>name</em>&nbsp;
                  {joinArrays(
                    String(name),
                    q,
                    "bg-black rounded px-0.5 text-white"
                  )}
                </span>
                <span>
                  <em>username</em>&nbsp;
                  {joinArrays(
                    String(username),
                    q,
                    "bg-black rounded px-0.5 text-white"
                  )}
                </span>
                <span>
                  <em>email</em>&nbsp;
                  {joinArrays(
                    String(email),
                    q,
                    "bg-black rounded px-0.5 text-white"
                  )}
                </span>
              </div>
            )}
          />
        </div>

        {newCase["client_id"] && (
          <>
            <InputFields
              data={newCase}
              onChange={(k, v, _type) => {
                setNewCase((p) => ({ ...p, [k]: v }));
              }}
              editableFields={[
                {
                  name: "title",
                  label: "Case Title",
                  options: { type: "text" },
                  required: true,
                },
                {
                  name: "description",
                  label: "Case Description",
                  options: { type: "textarea", rows: 3 },
                  required: true,
                },
                {
                  name: "case_no_or_parties",
                  label: "Case No. or Parties",
                  options: { type: "text" },
                  required: true,
                },
                {
                  name: "file_reference",
                  label: "File Reference",
                  options: { type: "text" },
                  required: true,
                },
                {
                  name: "clients_reference",
                  label: "Clients Reference",
                  options: { type: "text" },
                  required: true,
                },
                {
                  name: "record",
                  label: "Record",
                  options: { type: "number" },
                  required: true,
                },
                {
                  name: "status",
                  label: "Status",
                  options: {
                    type: "select",
                    options: caseStates.map(({ name }) => ({
                      name,
                      level: 0,
                      type: "item",
                      value: name,
                    })),
                  },
                  required: true,
                },
              ]}
            />

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                onClick={() => {
                  setOpenNewCaseModal(false);
                  setNewCase({});
                }}
                fullWidth
                variant="contained"
                sx={MUI_STYLES.Button2}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={creating}
                sx={MUI_STYLES.Button2}
                type="submit"
                fullWidth
                variant="contained"
              >
                Submit
              </LoadingButton>
            </div>
          </>
        )}
      </form>
    </ManualModal>
  );
}
