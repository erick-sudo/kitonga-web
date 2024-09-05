import { useParams } from "react-router-dom";
import { Case, Client, PaymentInformation } from "../../lib/definitions";
import { TanstackSuspense } from "../../ui/TanstackSuspense";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import useAPI from "../../hooks/useAPI";
import { axiosGet, axiosPatch } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { Alert } from "@mui/material";
import { CaseDetailsSkeleton, ClientDetailsSkeleton } from "../../ui/Skeletons";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { EditModal } from "../../ui/modals/EditModal";
import { useQueryClient } from "@tanstack/react-query";
import KTabs from "../../ui/Tabs";
import { caseStates } from "../../lib/data";
import { PaymentInformationDetails } from "./PaymentInformationdetails";

export function CaseDetails() {
  const handleRequest = useAPI();
  const { caseId } = useParams();
  const caseDetailsQueryKey = `${TANSTACK_QUERY_KEYS.CASE_DETAILS}#${caseId}`;
  const queryClient = useQueryClient();

  async function updateCaseDetails(payload: Record<string, string | number>) {
    return await handleRequest<PaymentInformation>({
      func: axiosPatch,
      args: [APIS.cases.patchCase.replace("<:caseId>", `${caseId}`), payload],
    }).then((res) => {
      if (res.status === "ok") {
        queryClient.invalidateQueries({
          queryKey: [caseDetailsQueryKey],
        });
        return true;
      } else {
        return false;
      }
    });
  }

  return (
    <div className="p-2">
      <div className="flex flex-col gap-8">
        <div>
          <div>
            <TanstackSuspense
              fallback={<CaseDetailsSkeleton />}
              queryKey={[caseDetailsQueryKey]}
              queryFn={() =>
                handleRequest<Case>({
                  func: axiosGet,
                  args: [APIS.cases.getCase.replace("<:caseId>", `${caseId}`)],
                })
              }
              RenderData={({ data }) => {
                if (data.status === "ok" && data.result) {
                  const {
                    title,
                    description,
                    case_no_or_parties,
                    client_id,
                    clients_reference,
                    file_reference,
                    record,
                    created_at,
                    updated_at,
                    status,
                  } = data.result;

                  return (
                    <div className="grid gap-2">
                      <div className="bg-white px-4 py-2 shadow rounded">
                        <div className="flex items-start border-b py-1">
                          <h4 className="min-w-44 max-w-44">Title</h4>
                          <p className="flex-grow">{title}</p>
                        </div>
                        <div className="flex items-start border-b py-1">
                          <h4 className="min-w-44 max-w-44">Description</h4>
                          <p className="flex-grow">{description}</p>
                        </div>
                        <div className="flex items-start border-b py-1">
                          <h4 className="min-w-44 max-w-44">
                            Case NO. or Parties
                          </h4>
                          <p className="flex-grow">{case_no_or_parties}</p>
                        </div>
                        <div className="flex items-start border-b py-1">
                          <h4 className="min-w-44 max-w-44">File Reference</h4>
                          <p className="flex-grow">{file_reference}</p>
                        </div>
                        <div className="flex items-start border-b py-1">
                          <h4 className="min-w-44 max-w-44">
                            Clients Reference
                          </h4>
                          <p className="flex-grow">{clients_reference}</p>
                        </div>
                        <div className="flex items-start border-b py-1">
                          <h4 className="min-w-44 max-w-44">Record</h4>
                          <p className="flex-grow">{record}</p>
                        </div>

                        <div className="flex justify-end flex-wrap gap-x-4 gap-y-2 py-1">
                          <div className="text-sm border rounded flex">
                            <span className="px-2 py-1 border-r">Created:</span>
                            <span className="px-2 py-1 font-semibold">
                              {new Date(created_at).toDateString()} at&nbsp;
                              {new Date(created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm border rounded flex">
                            <span className="px-2 py-1 border-r">
                              Last Updated:
                            </span>
                            <span className="px-2 py-1 font-semibold">
                              {new Date(updated_at).toDateString()} at&nbsp;
                              {new Date(updated_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm border rounded flex">
                            <span className="px-2 py-1 border-r">Status:</span>
                            <span className="px-2 py-1 font-semibold">
                              {status}
                            </span>
                          </div>
                          <EditModal
                            title={<h3>Modify case details</h3>}
                            className="grid gap-2"
                            anchorClassName="px-4 py-1 rounded text-sm text-white flex items-center gap-2 cursor-pointer bg-teal-800 hover:bg-teal-600 duration-300"
                            anchorContent={
                              <>
                                <span>Edit</span>
                                <PencilSquareIcon height={16} />
                              </>
                            }
                            initial={{
                              title,
                              case_no_or_parties,
                              description,
                              file_reference,
                              clients_reference,
                              record,
                              status,
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
                            onSubmit={updateCaseDetails}
                          />
                        </div>
                      </div>

                      <KTabs
                        items={[
                          {
                            label: "Client Details",
                            panel: <ClientDetails client_id={client_id} />,
                          },
                          {
                            label: "Payment Information",
                            panel: (
                              <PaymentInformationDetails caseId={`${caseId}`} />
                            ),
                          },
                        ]}
                      />
                    </div>
                  );
                }

                return (
                  <div className="shadow rounded mt-2">
                    <Alert severity="error">
                      <span className="block">{data.errors?.status}</span>
                      <span className="block">{data.errors?.error}</span>
                    </Alert>
                  </div>
                );
              }}
              defaultErrorClassName="p-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientDetails({ client_id }: { client_id: string }) {
  const handleRequest = useAPI();
  const clientKey = `${TANSTACK_QUERY_KEYS.CLIENT_DETAILS}#${client_id}`;
  return (
    <TanstackSuspense
      fallback={<ClientDetailsSkeleton />}
      queryKey={[clientKey]}
      queryFn={() =>
        handleRequest<Client>({
          func: axiosGet,
          args: [APIS.clients.getClient.replace("<:clientId>", client_id)],
        })
      }
      RenderData={({ data }) => {
        if (data.status === "ok" && data.result) {
          const { name, email, address, contact_number, username } = data.result;

          return (
            <div>
              <div className="bg-white border-l-8 border-teal-800 shadow rounded-r">
                <div className="">
                  <div className="grid grid-cols-">
                    <div className="flex items-start border-b py-1">
                      <h4 className="px-2 min-w-44 max-w-44">Name</h4>
                      <p className="flex-grow">{name}</p>
                    </div>
                    <div className="flex items-start border-b py-1">
                      <h4 className="px-2 min-w-44 max-w-44">Username</h4>
                      <p className="flex-grow">{username}</p>
                    </div>
                    <div className="flex items-start border-b py-1">
                      <h4 className="px-2 min-w-44 max-w-44">Email</h4>
                      <p className="flex-grow">{email}</p>
                    </div>
                    <div className="flex items-start border-b py-1">
                      <h4 className="px-2 min-w-44 max-w-44">Contact Number</h4>
                      <p className="flex-grow">{contact_number}</p>
                    </div>
                    <div className="flex items-start py-1">
                      <h4 className="px-2 min-w-44 max-w-44">Address</h4>
                      <p className="flex-grow">{address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="shadow rounded mt-2">
            <Alert severity="error">
              <span className="block">{data.errors?.status}</span>
              <span className="block">{data.errors?.error}</span>
            </Alert>
          </div>
        );
      }}
      defaultErrorClassName="p-4"
    />
  );
}
