import { Alert, Pagination, Tooltip } from "@mui/material";
import useAPI from "../../hooks/useAPI";
import { APIS } from "../../lib/apis";
import { axiosDelete, axiosGet, axiosPatch } from "../../lib/axiosLib";
import { Population, ResourceAction } from "../../lib/definitions";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import {
  TanstackSuspense,
  TanstackSuspensePaginated,
} from "../../ui/TanstackSuspense";
import KDrawer from "../../ui/drawers/KDrawer";
import {
  ChevronRightIcon,
  PencilSquareIcon,
  TrashIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import { CreateResourceActionForm } from "./CreateResourceActionForm";
import { Add, More } from "@mui/icons-material";
import { insertQueryParams } from "../../lib/utils";
import usePagination from "../../hooks/usePagination";
import InputSelection from "../../ui/InputSelection";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import DeleteModal from "../../ui/modals/DeleteModal";
import { EditModal } from "../../ui/modals/EditModal";
import { ManualModal } from "../../ui/modals/ManualModal";

export function ResourceActionList() {
  const queryClient = useQueryClient();
  const handleRequest = useAPI();
  const { currentPage, itemsPerPage, setNextPage, setNumberOfItemsPerPage } =
    usePagination({
      initialPage: 1,
    });

  async function updateAction(
    payload: Record<string, string | number>,
    actionId: string
  ) {
    return await handleRequest<ResourceAction>({
      func: axiosPatch,
      args: [
        APIS.authorization.resourceActions.show.replace(
          "<:actionId>",
          `${actionId}`
        ),
        payload,
      ],
    }).then((res) => {
      if (res.status === "ok") {
        queryClient.invalidateQueries({
          queryKey: [
            TANSTACK_QUERY_KEYS.RESOURCE_ACTIONS_LIST,
            itemsPerPage,
            currentPage,
          ],
        });
        return true;
      } else {
        return false;
      }
    });
  }
  return (
    <div>
      <div className="grid gap-2">
        <div>
          <KDrawer
            collapseClassName="border-r-2 border-y-2 rounded-r py-4 bg-white hover:text-white hover:bg-teal-800 duration-300 hover:border-teal-800"
            collapseContent={
              <>
                <ChevronRightIcon height={20} />
              </>
            }
            anchorPosition="right"
            anchorClassName="flex items-center gap-2 bg-teal-800 w-max text-white px-4 text-sm py-1 rounded hover:bg-teal-600 duration-300"
            anchorContent={
              <>
                <Add />
                <span>Create New Action</span>
              </>
            }
          >
            <div className="p-2">
              <CreateResourceActionForm
                onNewRecord={() => {
                  setNextPage(1);
                  queryClient.invalidateQueries({
                    queryKey: [
                      TANSTACK_QUERY_KEYS.RESOURCE_ACTION_COUNT,
                      itemsPerPage,
                      currentPage,
                    ],
                  });
                  queryClient.invalidateQueries({
                    queryKey: [
                      TANSTACK_QUERY_KEYS.RESOURCE_ACTIONS_LIST,
                      itemsPerPage,
                      currentPage,
                    ],
                  });
                }}
              />
            </div>
          </KDrawer>
        </div>
        <TanstackSuspensePaginated
          currentPage={currentPage}
          RenderPaginationIndicators={({ currentPage }) => (
            <TanstackSuspense
              queryKey={[
                TANSTACK_QUERY_KEYS.RESOURCE_ACTION_COUNT,
                itemsPerPage,
                currentPage,
              ]}
              queryFn={() => {
                const params: Record<string, string | number> = {
                  page_number: currentPage,
                  page_population: itemsPerPage,
                };

                return handleRequest<Population>({
                  func: axiosGet,
                  args: [
                    insertQueryParams(
                      APIS.authorization.resourceActions.count,
                      params
                    ),
                  ],
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
                        label="Actions per page"
                        name="actions_per_page"
                        options={[2, 5, 10, 25, 50, 75, 100].map((p) => ({
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
                    <Alert severity="warning">
                      Could not count resource actions...
                    </Alert>
                  </div>
                );
              }}
            />
          )}
          queryKey={[
            TANSTACK_QUERY_KEYS.RESOURCE_ACTIONS_LIST,
            itemsPerPage,
            currentPage,
          ]}
          queryFn={() => {
            const params: Record<string, string | number> = {
              page_number: currentPage,
              page_population: itemsPerPage,
            };

            return handleRequest<ResourceAction[]>({
              func: axiosGet,
              args: [
                insertQueryParams(
                  APIS.authorization.resourceActions.index,
                  params
                ),
              ],
            });
          }}
          RenderData={({ data }) => {
            if (data.status === "ok" && data.result) {
              const resourceActions = data.result;
              return (
                <>
                  {resourceActions.length > 0 ? (
                    <div className="grid">
                      <div className="bg-white rounded border shadow">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="px-4 text-start py-1">Name</th>
                              <th className="px-4 text-start py-1">Created</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody className="">
                            {resourceActions.map(
                              ({ id, name, created_at, updated_at }, index) => (
                                <tr key={index} className="border-t">
                                  <td className="px-4 py-1">{name}</td>
                                  <td className="px-4 py-1">
                                    {new Date(created_at).toDateString()}
                                  </td>
                                  <td className="flex justify-end pr-2">
                                    <Tooltip
                                      title={
                                        <div>
                                          <EditModal
                                            title={<h3>Modify action name</h3>}
                                            className="grid gap-2"
                                            anchorClassName="flex items-center gap-2 px-2 py-1 cursor-pointer"
                                            anchorContent={
                                              <>
                                                <PencilSquareIcon height={16} />
                                                <span>Edit</span>
                                              </>
                                            }
                                            initial={{
                                              name,
                                            }}
                                            editableFields={[
                                              {
                                                name: "name",
                                                label: "Name",
                                                options: { type: "text" },
                                                required: true,
                                              },
                                            ]}
                                            onSubmit={async (payload) => {
                                              return await updateAction(
                                                payload,
                                                id
                                              );
                                            }}
                                          />
                                          <ManualModal
                                            anchorClassName="flex items-center gap-2 px-2 py-1 cursor-pointer"
                                            anchorContent={
                                              <>
                                                <ViewfinderCircleIcon
                                                  height={16}
                                                />
                                                <span>See More</span>
                                              </>
                                            }
                                          >
                                            <h3>Action details</h3>
                                            <div className="border rounded">
                                              <div className="flex items-start">
                                                <span className="w-36 px-4 py-1 border-r">
                                                  ID
                                                </span>
                                                <span className="flex-grow px-4 py-1 break-all">
                                                  {id}
                                                </span>
                                              </div>
                                              <div className="border-t flex items-start">
                                                <span className="w-36 px-4 py-1 border-r">
                                                  Name
                                                </span>
                                                <span className="flex-grow px-4 py-1">
                                                  {name}
                                                </span>
                                              </div>
                                              <div className="border-t flex items-start">
                                                <span className="w-36 px-4 py-1 border-r">
                                                  Created
                                                </span>
                                                <span className="flex-grow px-4 py-1">
                                                  {new Date(
                                                    created_at
                                                  ).toDateString()}
                                                  &nbsp;at&nbsp;
                                                  {new Date(
                                                    created_at
                                                  ).toLocaleTimeString()}
                                                </span>
                                              </div>
                                              <div className="border-t flex items-start">
                                                <span className="w-36 px-4 py-1 border-r">
                                                  Last Updated
                                                </span>
                                                <span className="flex-grow px-4 py-1">
                                                  {new Date(
                                                    updated_at
                                                  ).toDateString()}
                                                  &nbsp;at&nbsp;
                                                  {new Date(
                                                    updated_at
                                                  ).toLocaleTimeString()}
                                                </span>
                                              </div>
                                            </div>
                                          </ManualModal>
                                          <DeleteModal
                                            passKey="delete action"
                                            anchorClassName="flex items-center gap-2 px-2 py-1 cursor-pointer"
                                            anchorContent={
                                              <>
                                                <TrashIcon height={16} />
                                                <span>Delete</span>
                                              </>
                                            }
                                            onSubmit={async () =>
                                              handleRequest<null>({
                                                func: axiosDelete,
                                                args: [
                                                  APIS.authorization.resourceActions.destroy.replace(
                                                    "<:actionId>",
                                                    id
                                                  ),
                                                ],
                                              }).then((res) => {
                                                queryClient.invalidateQueries({
                                                  queryKey: [
                                                    TANSTACK_QUERY_KEYS.RESOURCE_ACTIONS_LIST,
                                                    itemsPerPage,
                                                    currentPage,
                                                  ],
                                                });
                                                if (res.status === "ok") {
                                                  return {
                                                    status: "success",
                                                    message:
                                                      "Action deleted successfully.",
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
                                                  message:
                                                    "Sorry, an error occured!",
                                                };
                                              })
                                            }
                                          >
                                            <h3>
                                              You are about to delete this
                                              action
                                            </h3>
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
                                            </div>
                                          </DeleteModal>
                                        </div>
                                      }
                                    >
                                      <span className="text-teal-600">
                                        <More />
                                      </span>
                                    </Tooltip>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded shadow overflow-hidden border">
                      <Alert severity="info">No results found!!</Alert>
                    </div>
                  )}
                </>
              );
            }
            return (
              <div className="rounded shadow overflow-hidden border">
                <Alert severity="error">
                  Sorry!, could not fetch resource actions!
                </Alert>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
