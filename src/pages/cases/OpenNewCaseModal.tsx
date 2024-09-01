import { useState } from "react";
import useAPI from "../../hooks/useAPI";
import { useQueryClient } from "@tanstack/react-query";
import { ManualModal } from "../../ui/modals/ManualModal";
import { Add } from "@mui/icons-material";
import { TanstackSuspense } from "../../ui/TanstackSuspense";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import { PartialClient } from "../../lib/definitions";
import { axiosGet, axiosPost } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { InputField, InputFields } from "../../ui/modals/EditModal";
import { caseStates } from "../../lib/data";
import { Alert, Button } from "@mui/material";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { LoadingButton } from "@mui/lab";
import { NavLink } from "react-router-dom";
import { InputOption } from "../../ui/InputSelection";

export function OpenNewCaseModal() {
  const handleRequest = useAPI();
  const queryClient = useQueryClient();
  const [newCase, setNewCase] = useState<Record<string, string | number>>({
    client_id: "",
    title: "",
    description: "",
    case_no_or_parties: "",
  });
  const [creating, setCreating] = useState(false);
  const [openNewCaseModal, setOpenNewCaseModal] = useState(false);

  function handleCreateCase() {
    setCreating(true);
    handleRequest({
      func: axiosPost,
      args: [APIS.cases.postCase, newCase],
    })
      .then((res) => {
        if (res.status === "ok") {
          setOpenNewCaseModal(false);
          queryClient.invalidateQueries({
            queryKey: [TANSTACK_QUERY_KEYS.CASE_LIST],
          });
        } else {
          alert("Error");
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
        <TanstackSuspense
          fallback={
            <div className="flex items-center gap-2 bg-white shadow p-4 rounded">
              <span className=" animate-spin">
                <Cog8ToothIcon height={20} />
              </span>
              <div>Fetching clients...</div>
            </div>
          }
          queryKey={[TANSTACK_QUERY_KEYS.ALL_CLIENTS]}
          queryFn={() =>
            handleRequest<PartialClient[]>({
              func: axiosGet,
              args: [APIS.clients.getAllClients],
            })
          }
          RenderData={({ data }) => {
            if (data.status === "ok" && data.result) {
              const clients = data.result;

              const clientInputOptions: InputOption[] = clients.map(
                ({ id, name }) => ({
                  name,
                  level: 0,
                  type: "item",
                  value: id,
                })
              );

              return (
                <>
                  {clients.length > 0 ? (
                    <InputField
                      name="client_id"
                      label="Select Client"
                      value={newCase["client_id"] || ""}
                      onChange={(newValue) => {
                        setNewCase((p) => ({ ...p, client_id: newValue }));
                      }}
                      options={{
                        type: "select",
                        options: [
                          { name: "None", level: 0, type: "item", value: "" },
                          ...clientInputOptions,
                        ],
                      }}
                      required={true}
                    />
                  ) : (
                    <div className="flex items-center justify-between gap-2 bg-teal-50 shadow p-4 rounded">
                      No client found...
                      <NavLink
                        className="px-4 text-sm py-1 bg-teal-800 text-white rounded hover:bg-teal-600 duration-300"
                        to="/dashboard/clients"
                      >
                        Create Client
                      </NavLink>
                    </div>
                  )}
                </>
              );
            }
            return (
              <div>
                <Alert severity="error">
                  Sorry, an error occured while fetching clients
                </Alert>
              </div>
            );
          }}
        />
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
