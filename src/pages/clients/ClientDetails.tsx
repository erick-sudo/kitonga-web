import { Alert } from "@mui/material";
import useAPI from "../../hooks/useAPI";
import { APIS } from "../../lib/apis";
import { axiosDelete, axiosGet, axiosPatch } from "../../lib/axiosLib";
import { Client } from "../../lib/definitions";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import { ClientDetailsSkeleton } from "../../ui/Skeletons";
import { TanstackSuspense } from "../../ui/TanstackSuspense";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import DeleteModal from "../../ui/modals/DeleteModal";
import { EditModal } from "../../ui/modals/EditModal";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ApacheEChart, areaChartOptions } from "../../ui/ApacheEChart";

export function ClientDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clientId } = useParams();
  const handleRequest = useAPI();
  const clientKey = `${TANSTACK_QUERY_KEYS.CLIENT_DETAILS}#${clientId}`;

  async function updateClientDetails(payload: Record<string, string | number>) {
    return await handleRequest<Client>({
      func: axiosPatch,
      args: [
        APIS.clients.patchClient.replace("<:clientId>", `${clientId}`),
        payload,
      ],
    }).then((res) => {
      if (res.status === "ok") {
        queryClient.invalidateQueries({
          queryKey: [clientKey],
        });
        return true;
      } else {
        return false;
      }
    });
  }
  return (
    <div className="p-2">
      <TanstackSuspense
        fallback={<ClientDetailsSkeleton />}
        queryKey={[clientKey]}
        queryFn={() =>
          handleRequest<Client>({
            func: axiosGet,
            args: [
              APIS.clients.getClient.replace("<:clientId>", `${clientId}`),
            ],
          })
        }
        RenderData={({ data }) => {
          if (data.status === "ok" && data.result) {
            const {
              id,
              name,
              email,
              address,
              contact_number,
              username,
              created_at,
              updated_at,
            } = data.result;

            return (
              <div className="grid gap-2">
                <div className="bg-white shadow rounded">
                  <div className="">
                    <div className="grid">
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
                        <h4 className="px-2 min-w-44 max-w-44">
                          Contact Number
                        </h4>
                        <p className="flex-grow">{contact_number}</p>
                      </div>
                      <div className="flex items-start py-1 border-b">
                        <h4 className="px-2 min-w-44 max-w-44">Address</h4>
                        <p className="flex-grow">{address}</p>
                      </div>
                    </div>

                    <div className="py-1 flex gap-2 px-2 justify-end flex-wrap">
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
                      <EditModal
                        title={<h3>Modify client details</h3>}
                        className="grid gap-2"
                        anchorClassName="px-2 py-1 rounded text-sm text-white flex items-center gap-2 cursor-pointer bg-teal-800 hover:bg-teal-600 duration-300"
                        anchorContent={
                          <>
                            <PencilSquareIcon height={20} />
                          </>
                        }
                        initial={{
                          name,
                          username,
                          email,
                          contact_number,
                          address,
                          password: "",
                        }}
                        editableFields={[
                          {
                            name: "name",
                            label: "Name",
                            options: { type: "text" },
                            required: true,
                          },
                          {
                            name: "username",
                            label: "Username",
                            options: { type: "text" },
                            required: true,
                          },
                          {
                            name: "email",
                            label: "Email Address",
                            options: { type: "email" },
                            required: true,
                          },
                          {
                            name: "contact_number",
                            label: "Contact Number",
                            options: { type: "text" },
                            required: true,
                          },
                          {
                            name: "address",
                            label: "Address",
                            options: { type: "textarea", rows: 2 },
                            required: true,
                          },
                          {
                            name: "password",
                            label: "Password",
                            options: { type: "password" },
                            required: true,
                          },
                        ]}
                        onSubmit={updateClientDetails}
                      />
                      <DeleteModal
                        passKey={`delete client : ${username}`}
                        onSubmit={() =>
                          handleRequest<null>({
                            func: axiosDelete,
                            args: [
                              APIS.clients.deleteClient.replace(
                                "<:clientId>",
                                id
                              ),
                            ],
                          }).then((res) => {
                            queryClient.invalidateQueries({
                              queryKey: [clientKey],
                            });
                            if (res.status === "ok") {
                              navigate("/dashboard/clients");
                              return {
                                status: "success",
                                message: "Client deleted successfully.",
                              };
                            }

                            if (res.status === "403") {
                              return {
                                status: "error",
                                message: `${res.errors.status}: ${res.errors.error}`,
                              };
                            }

                            return {
                              status: "error",
                              message: "Sorry, an error occured!",
                            };
                          })
                        }
                        anchorClassName="px-2 py-1 rounded text-sm text-white flex items-center gap-2 cursor-pointer bg-teal-800 hover:text-red-800 hover:ring-1 hover:ring-red-800 duration-300"
                        anchorContent={
                          <>
                            <TrashIcon height={20} />
                          </>
                        }
                      >
                        <h3>You are about to delete this client</h3>
                        <div className="border rounded">
                          <div className="flex items-start">
                            <span className="w-24 px-4 py-1 border-r">ID</span>
                            <span className="flex-grow px-4 py-1 break-all">
                              {id}
                            </span>
                          </div>
                          <div className="border-t flex items-start">
                            <span className="w-24 px-4 py-1 border-r">
                              Name
                            </span>
                            <span className="flex-grow px-4 py-1">{name}</span>
                          </div>
                          <div className="border-t flex items-start">
                            <span className="w-24 px-4 py-1 border-r">
                              Email Address
                            </span>
                            <span className="flex-grow px-4 py-1">{email}</span>
                          </div>
                        </div>
                      </DeleteModal>
                    </div>
                  </div>
                </div>

                <TanstackSuspense
                  fallback={<ClientDetailsSkeleton />}
                  queryKey={[`${clientKey}#status-tally`]}
                  queryFn={() =>
                    handleRequest<Record<string, number>>({
                      func: axiosGet,
                      args: [
                        APIS.statistics.showClientCaseStatusTally.replace(
                          "<:clientId>",
                          `${clientId}`
                        ),
                      ],
                    })
                  }
                  RenderData={({ data }) => {
                    if (data.status === "ok" && data.result) {
                      const tally = data.result;

                      const statuses = Object.entries(tally).map(([k]) => k);

                      return (
                        <div className="bg-white rounded border shadow p-4 zero-size-horizontal-scrollbar">
                          <ApacheEChart
                            options={areaChartOptions({
                              title: "Cases tally by status",
                              xAxisLabels: statuses,
                              series: [
                                {
                                  name: "Number of cases",
                                  color: "teal",
                                  data: statuses.map((k) => tally[k]),
                                },
                              ],
                            })}
                            className="min-h-96 border"
                          />
                        </div>
                      );
                    }

                    // Could not tally client cases
                    return (
                      <div className="shadow rounded mt-2">
                        <Alert severity="error">
                          <span className="block">{data.errors?.status}</span>
                          <span className="block">{data.errors?.error}</span>
                        </Alert>
                      </div>
                    );
                  }}
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
  );
}
