import {
  BackspaceIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import useAPI from "../../hooks/useAPI";
import { APIS } from "../../lib/apis";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "../../lib/axiosLib";
import { Client, Population } from "../../lib/definitions";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import {
  TanstackSuspense,
  TanstackSuspensePaginated,
} from "../../ui/TanstackSuspense";
import { NavLink, useSearchParams } from "react-router-dom";
import { ClientListSkeleton } from "../../ui/Skeletons";
import { Alert, Pagination } from "@mui/material";
import InputSelection from "../../ui/InputSelection";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { EditModal } from "../../ui/modals/EditModal";
import { useQueryClient } from "@tanstack/react-query";
import { insertQueryParams } from "../../lib/utils";
import usePagination from "../../hooks/usePagination";
import { Search } from "../../ui/Search";
import { useState } from "react";
import DeleteModal from "../../ui/modals/DeleteModal";
import { Add } from "@mui/icons-material";

const endpoints = {
  index: {
    data: APIS.pagination.getClients,
    count: APIS.statistics.clientsCount,
  },
  search: {
    data: APIS.pagination.search.searchClients,
    count: APIS.statistics.searchClientsCount,
  },
};

export function ClientList() {
  const handleRequest = useAPI();
  const queryClient = useQueryClient();
  const [queryStringParams, _setQueryStringParams] = useSearchParams();
  const { currentPage, itemsPerPage, setNextPage, setNumberOfItemsPerPage } =
    usePagination();
  const [api, setApi] = useState<keyof typeof endpoints>("index");
  const [queryParams, setQueryParams] = useState<
    Record<string, string | number>
  >({});

  async function handleCreateClient(payload: Record<string, string | number>) {
    const res = await handleRequest({
      func: axiosPost,
      args: [APIS.clients.postClient, payload],
    });
    if (res.status === "ok") {
      queryClient.invalidateQueries({
        queryKey: [
          TANSTACK_QUERY_KEYS.CLIENT_LIST,
          api,
          queryParams,
          itemsPerPage,
        ],
      });
      return true;
    } else {
      return false;
    }
  }

  async function updateClientDetails(
    payload: Record<string, string | number>,
    clientId: string
  ) {
    return await handleRequest<Client>({
      func: axiosPatch,
      args: [
        APIS.clients.patchClient.replace("<:clientId>", `${clientId}`),
        payload,
      ],
    }).then((res) => {
      if (res.status === "ok") {
        queryClient.invalidateQueries({
          queryKey: [
            TANSTACK_QUERY_KEYS.CLIENT_LIST,
            api,
            queryParams,
            itemsPerPage,
          ],
        });
        return true;
      } else {
        return false;
      }
    });
  }

  return (
    <div className="p-2 grid gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => {
            setQueryParams({});
            setApi("index");
          }}
          className="text-sm text-white px-2 rounded bg-teal-800 cursor-pointer hover:bg-teal-600 duration-300"
        >
          <BackspaceIcon height={20} />
        </button>
        {/* <div>
          <InputSelection
            name="search_by"
            label="Search by"
            value={queryStringParams.get("q") || "title"}
            onChange={(v) => {
              queryStringParams.set("q", v);
              setQueryStringParams(queryStringParams);
            }}
            options={[
              "id",
              "title",
              "case_no_or_parties",
              "file_reference",
              "clients_reference",
              "record",
            ].map((k) => ({
              value: k,
              name: snakeCaseToTitleCase(k),
              level: 0,
              type: "item",
            }))}
          />
        </div> */}
        <Search
          queryKey="v"
          onSubmit={(v) => {
            setQueryParams({
              q: queryStringParams.get("q") || "name",
              v,
            });
            setApi("search");
          }}
          className="flex-grow rounded overflow-hidden shadow"
        />

        <EditModal
          title={<h3>Create new client</h3>}
          className="grid gap-2"
          anchorClassName="flex items-center gap-2 text-white px-4 rounded text-sm py-1 bg-teal-800 w-max cursor-pointer hover:bg-teal-600 duration-300"
          anchorContent={
            <>
              <Add height={16} />
              <span className=" whitespace-nowrap">New Client</span>
            </>
          }
          initial={{
            name: "",
            username: "",
            email: "",
            contact_number: "",
            address: "",
            password: "",
            password_confirmation: "",
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
              label: "password",
              options: { type: "password" },
              required: true,
            },
            {
              name: "password_confirmation",
              label: "password_confirmation",
              options: { type: "password" },
              required: true,
            },
          ]}
          onSubmit={handleCreateClient}
        />
      </div>
      <TanstackSuspensePaginated
        currentPage={currentPage}
        queryKey={[
          TANSTACK_QUERY_KEYS.CLIENT_LIST,
          api,
          queryParams,
          itemsPerPage,
        ]}
        queryFn={() => {
          const params: Record<string, string | number> = {
            page_number: currentPage,
            page_population: itemsPerPage,
            ...queryParams,
          };

          return handleRequest<Client[]>({
            func: axiosGet,
            args: [insertQueryParams(endpoints[api].data, params)],
          });
        }}
        fallback={<ClientListSkeleton size={8} />}
        RenderPaginationIndicators={({ currentPage }) => (
          <TanstackSuspense
            queryKey={[TANSTACK_QUERY_KEYS.CASE_COUNT, api]}
            queryFn={() => {
              const params: Record<string, string | number> = {
                page_number: currentPage,
                page_population: itemsPerPage,
                ...queryParams,
              };

              return handleRequest<Population>({
                func: axiosGet,
                args: [insertQueryParams(endpoints[api].count, params)],
              });
            }}
            RenderData={({ data }) => {
              if (data.status === "ok" && data.result) {
                const { count } = data.result;

                return (
                  <div className="p-2 shadow rounded bg-white flex items-center gap-4">
                    <InputSelection
                      value={itemsPerPage}
                      onChange={(newValue) =>
                        setNumberOfItemsPerPage(Number(newValue))
                      }
                      label="Cases per page"
                      name="cases_per_page"
                      options={[5, 10, 25, 50, 75, 100].map((p) => ({
                        name: p,
                        value: p,
                        level: 0,
                        type: "item",
                      }))}
                      sx={{
                        ...MUI_STYLES.FilledInputTextField3,
                        width: "8rem",
                      }}
                    />

                    <div className="flex-grow flex">
                      <Pagination
                        page={currentPage}
                        onChange={(_, page) => {
                          setNextPage(page);
                        }}
                        size="small"
                        count={Math.ceil(count / Number(itemsPerPage))}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div className="rounded overflow-hidden shadow-sm">
                  <Alert severity="warning">Could not count cases...</Alert>
                </div>
              );
            }}
          />
        )}
        RenderData={({ data }) => {
          if (data.status !== "ok" || !!!data.result) {
            return (
              <div className="rounded overflow-hidden shadow-sm">
                <Alert severity="warning">Could not fetch cases...</Alert>
              </div>
            );
          }

          const clients = data.result;

          return (
            <div className="grid gap-2">
              {data.result.length > 0 ? (
                <div className="bg-white rounded border shadow p-2 horizontal-scrollbar pb-2">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 truncate text-start">Name</th>
                        <th className="px-2 py-1 truncate text-start">
                          Username
                        </th>
                        <th className="px-2 py-1 truncate text-start">Email</th>
                        <th className="px-2 py-1 truncate text-start">
                          Contact Number
                        </th>
                        <th className="px-2 py-1 truncate text-start">
                          Address
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map(
                        (
                          {
                            id,
                            name,
                            username,
                            email,
                            contact_number,
                            address,
                          },
                          index
                        ) => (
                          <tr className="border-t" key={index}>
                            <td className="px-2 py-1 truncate text-start">
                              <NavLink
                                className="text-teal-600 underline hover:text-teal-800"
                                to={`details/${id}`}
                              >
                                {name}
                              </NavLink>
                            </td>
                            <td className="px-2 py-1 truncate text-start">
                              {username}
                            </td>
                            <td className="px-2 py-1 truncate text-start">
                              {email}
                            </td>
                            <td className="px-2 py-1 truncate text-start">
                              {contact_number}
                            </td>
                            <td className="px-2 py-1 truncate text-start">
                              {address}
                            </td>
                            <td className="px-2 py-1 truncate text-start">
                              <div className="py-1 flex gap-2">
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
                                  ]}
                                  onSubmit={async (payload) => {
                                    return await updateClientDetails(
                                      payload,
                                      id
                                    );
                                  }}
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
                                        queryKey: [
                                          TANSTACK_QUERY_KEYS.CLIENT_LIST,
                                          api,
                                          queryParams,
                                          itemsPerPage,
                                        ],
                                      });
                                      if (res.status === "ok") {
                                        return {
                                          status: "success",
                                          message:
                                            "Client deleted successfully.",
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
                                      <span className="w-24 px-4 py-1 border-r">
                                        ID
                                      </span>
                                      <span className="flex-grow px-4 py-1 break-all">
                                        {id}
                                      </span>
                                    </div>
                                    <div className="border-t flex items-start">
                                      <span className="w-24 px-4 py-1 border-r">
                                        Name
                                      </span>
                                      <span className="flex-grow px-4 py-1">
                                        {name}
                                      </span>
                                    </div>
                                    <div className="border-t flex items-start">
                                      <span className="w-24 px-4 py-1 border-r">
                                        Email Address
                                      </span>
                                      <span className="flex-grow px-4 py-1">
                                        {email}
                                      </span>
                                    </div>
                                  </div>
                                </DeleteModal>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-white rounded shadow">
                  No Results Found...
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
