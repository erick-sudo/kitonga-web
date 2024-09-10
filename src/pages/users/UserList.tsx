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
import { User, Population } from "../../lib/definitions";
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
import { insertQueryParams, snakeCaseToTitleCase } from "../../lib/utils";
import usePagination from "../../hooks/usePagination";
import { Search } from "../../ui/Search";
import { useContext, useState } from "react";
import DeleteModal from "../../ui/modals/DeleteModal";
import { Add, More } from "@mui/icons-material";
import { KTooltip } from "../../ui/KTooltip";
import TableValues from "../../ui/TableValues";
import { AlertResponse } from "../../ui/definitions";
import { AlertContext } from "../Dashboard";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";

const endpoints = {
  index: APIS.users.index,
  search: APIS.users.searchUsers,
};

export function UserList() {
  const handleRequest = useAPI();
  const queryClient = useQueryClient();
  const { pushAlert } = useContext(AlertContext);
  const [queryStringParams, _setQueryStringParams] = useSearchParams();
  const { currentPage, itemsPerPage, setNextPage, setNumberOfItemsPerPage } =
    usePagination();
  const [api, setApi] = useState<keyof typeof endpoints>("index");
  const [queryParams, setQueryParams] = useState<
    Record<string, string | number>
  >({});

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: [
        TANSTACK_QUERY_KEYS.USER_LIST,
        api,
        currentPage,
        itemsPerPage,
        queryParams,
      ],
    });
    queryClient.invalidateQueries({
      queryKey: [
        TANSTACK_QUERY_KEYS.USER_COUNT,
        api,
        currentPage,
        itemsPerPage,
        queryParams,
      ],
    });
  };

  async function handleCreateUser(payload: Record<string, string | number>) {
    const res = await handleRequest({
      func: axiosPost,
      args: [APIS.users.index, payload],
    });
    if (res.status === "ok") {
      refresh();
      pushAlert(
        {
          status: "success",
          message: `Successfully recorded a new user.`,
        },
        10000
      );
      return true;
    } else {
      pushAlert(
        {
          status: "error",
          message: (
            <RequestErrorsWrapperNode
              fallbackMessage="Could not create user!"
              requestError={res}
            />
          ),
        },
        10000
      );
      return false;
    }
  }

  async function updateUserDetails(
    payload: Record<string, string | number>,
    userId: string
  ) {
    return await handleRequest<User>({
      func: axiosPatch,
      args: [APIS.users.mutate.replace("<:userId>", `${userId}`), payload],
    }).then((res) => {
      if (res.status === "ok") {
        refresh();
        pushAlert(
          {
            status: "success",
            message: `Successfully updated user details.`,
          },
          10000
        );
        return true;
      } else {
        pushAlert(
          {
            status: "error",
            message: (
              <RequestErrorsWrapperNode
                fallbackMessage="Could not update user details."
                requestError={res}
              />
            ),
          },
          10000
        );
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
              "name",
              "username",
              "email",
              "contact_number",
              "address"
            ].map((k) => ({
              value: k,
              name: snakeCaseToTitleCase(k),
              level: 0,
              type: "item",
            }))}
          />
        </div> */}
        <Search
          placeholder="Search users..."
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
          title={<h3>Create new user</h3>}
          className="grid gap-2"
          anchorClassName="flex items-center gap-2 text-white px-4 rounded text-sm py-1 bg-teal-800 w-max cursor-pointer hover:bg-teal-600 duration-300"
          anchorContent={
            <>
              <Add height={16} />
              <span className=" whitespace-nowrap">New User</span>
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
              label: "Confirm Password",
              options: { type: "password" },
              required: true,
            },
          ]}
          onSubmit={handleCreateUser}
        />
      </div>
      <TanstackSuspensePaginated
        currentPage={currentPage}
        queryKey={[
          TANSTACK_QUERY_KEYS.USER_LIST,
          api,
          currentPage,
          itemsPerPage,
          queryParams,
        ]}
        queryFn={() => {
          const params: Record<string, string | number> = {
            page_number: currentPage,
            page_population: itemsPerPage,
            ...queryParams,
            response: "data",
          };

          return handleRequest<User[]>({
            func: axiosGet,
            args: [insertQueryParams(endpoints[api], params)],
          });
        }}
        fallback={<ClientListSkeleton size={8} />}
        RenderPaginationIndicators={({ currentPage }) => (
          <TanstackSuspense
            queryKey={[
              TANSTACK_QUERY_KEYS.USER_COUNT,
              api,
              currentPage,
              itemsPerPage,
              queryParams,
            ]}
            queryFn={() => {
              const params: Record<string, string | number> = {
                page_number: currentPage,
                page_population: itemsPerPage,
                ...queryParams,
                response: "count",
              };

              return handleRequest<Population>({
                func: axiosGet,
                args: [insertQueryParams(endpoints[api], params)],
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
                      label="Users per page"
                      name="users_per_page"
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
                  <Alert severity="warning">Could not count users...</Alert>
                </div>
              );
            }}
          />
        )}
        RenderData={({ data }) => {
          if (data.status !== "ok" || !!!data.result) {
            return (
              <div className="rounded overflow-hidden shadow-sm">
                <Alert severity="warning">
                  <RequestErrorsWrapperNode
                    fallbackMessage="Could not fetch users..."
                    requestError={data}
                  />
                </Alert>
              </div>
            );
          }

          const users = data.result;

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
                          Contact
                        </th>
                        <th className="px-2 py-1 truncate text-start">
                          Address
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(
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
                            <td className="flex justify-end pr-2">
                              <KTooltip
                                tooltipContainerClassName="shadow shadow-black/50 bg-white-100/10 backdrop-blur rounded overflow-hidden"
                                tooltipContent={
                                  <>
                                    <EditModal
                                      title={<h3>Modify user details</h3>}
                                      className="grid gap-2"
                                      anchorClassName="flex items-center gap-2 px-2 py-1 cursor-pointer hover:text-white hover:bg-teal-800 duration-300"
                                      anchorContent={
                                        <>
                                          <PencilSquareIcon height={20} />
                                          <span>Edit</span>
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
                                          options: {
                                            type: "textarea",
                                            rows: 2,
                                          },
                                          required: true,
                                        },
                                      ]}
                                      onSubmit={async (payload) => {
                                        return await updateUserDetails(
                                          payload,
                                          id
                                        );
                                      }}
                                    />
                                    <DeleteModal
                                      passKey={`delete user - ${username}`}
                                      onSubmit={() =>
                                        handleRequest<null>({
                                          func: axiosDelete,
                                          args: [
                                            APIS.users.mutate.replace(
                                              "<:userId>",
                                              id
                                            ),
                                          ],
                                        }).then((res) => {
                                          let rs: AlertResponse;
                                          if (res.status === "ok") {
                                            refresh();
                                            rs = {
                                              status: "success",
                                              message:
                                                "User deleted successfully.",
                                            };
                                          } else {
                                            rs = {
                                              status: "error",
                                              message: (
                                                <RequestErrorsWrapperNode
                                                  fallbackMessage="Could not delete user."
                                                  requestError={res}
                                                />
                                              ),
                                            };
                                          }

                                          pushAlert(rs, 10000);

                                          return rs;
                                        })
                                      }
                                      anchorClassName="flex items-center gap-2 px-2 py-1 cursor-pointer hover:text-white hover:bg-red-800 duration-300"
                                      anchorContent={
                                        <>
                                          <TrashIcon height={20} />
                                          <span>Delete</span>
                                        </>
                                      }
                                    >
                                      <h3>You are about to delete this user</h3>
                                      <TableValues
                                        transformKeys={(k) =>
                                          snakeCaseToTitleCase(k)
                                        }
                                        className="rounded text-sm"
                                        values={{
                                          id,
                                          name,
                                          username,
                                          email,
                                          contact_number,
                                          address,
                                        }}
                                        valueClassName="gap-2"
                                        copy={{
                                          fields: ["id", "username", "email"],
                                          copyContentProps: {
                                            iconClassName: "p-0.5",
                                            className:
                                              "flex items-center border border-gray-500 text-gray-500 rounded",
                                          },
                                        }}
                                      />
                                    </DeleteModal>
                                  </>
                                }
                              >
                                <span className="text-teal-600">
                                  <More />
                                </span>
                              </KTooltip>
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
