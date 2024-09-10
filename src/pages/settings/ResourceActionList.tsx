import { Alert, Pagination } from "@mui/material";
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
import { Add, More, MoreHorizOutlined } from "@mui/icons-material";
import {
  insertQueryParams,
  joinArrays,
  snakeCaseToTitleCase,
} from "../../lib/utils";
import usePagination from "../../hooks/usePagination";
import InputSelection from "../../ui/InputSelection";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { useQueryClient } from "@tanstack/react-query";
import DeleteModal from "../../ui/modals/DeleteModal";
import { EditModal } from "../../ui/modals/EditModal";
import { ManualModal } from "../../ui/modals/ManualModal";
import { LazySearch } from "../../ui/Search";
import { CreateNamedEntity } from "./CreateNamedEntity";
import { KTooltip } from "../../ui/KTooltip";
import TableValues from "../../ui/TableValues";
import { AlertResponse } from "../../ui/definitions";
import { useContext } from "react";
import { AlertContext } from "../Dashboard";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";

export function ResourceActionList() {
  const queryClient = useQueryClient();
  const handleRequest = useAPI();
  const { currentPage, itemsPerPage, setNextPage, setNumberOfItemsPerPage } =
    usePagination({
      initialPage: 1,
    });
  const { pushAlert } = useContext(AlertContext);

  const refresh = () => {
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
  };

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
        refresh();
        pushAlert({
          status: "success",
          message: "Action updated successfully",
        });
        return true;
      } else {
        pushAlert({
          status: "error",
          message: (
            <RequestErrorsWrapperNode
              fallbackMessage="Could not update action."
              requestError={res}
            />
          ),
        });
        return false;
      }
    });
  }
  return (
    <div>
      <div className="grid gap-2">
        <div className="flex gap-2">
          <KDrawer
            collapseClassName="border-r-2 border-y-2 rounded-r py-4 bg-white hover:text-white hover:bg-teal-800 duration-300 hover:border-teal-800"
            collapseContent={
              <>
                <ChevronRightIcon height={20} />
              </>
            }
            anchorPosition="right"
            anchorClassName="flex items-center gap-2 bg-teal-800 w-max text-white px-4 text-sm rounded hover:bg-teal-600 duration-300"
            anchorContent={
              <>
                <Add />
                <span>Create New Action</span>
              </>
            }
          >
            <div className="p-2">
              <CreateNamedEntity
                entity="Action"
                endpoint={APIS.authorization.resourceActions.create}
                onNewRecord={() => {
                  setNextPage(1);
                  refresh();
                }}
              />
            </div>
          </KDrawer>
          <div className="flex-grow max-w-xl">
            <LazySearch
              containerClassName="h-10"
              placeholder="Seach actions..."
              zIndex={20}
              viewPortClassName="max-h-36 vertical-scrollbar"
              className="border bg-white rounded shadow"
              fetchItems={(q: string) =>
                handleRequest<ResourceAction[]>({
                  func: axiosGet,
                  args: [
                    insertQueryParams(
                      APIS.authorization.searchResource.replace(
                        "<:resource>",
                        "resourceaction"
                      ),
                      { q }
                    ),
                  ],
                }).then((res) => {
                  if (res.status === "ok" && res.result) {
                    return res.result;
                  }
                  return [];
                })
              }
              childClassName="border-b mr-2 first:border-t"
              RenderItem={({ q, item: { id, name } }) => (
                <div className="flex items-center">
                  <span className="px-2">
                    {joinArrays(
                      String(name),
                      q,
                      "bg-black text-white px-0.5 rounded"
                    )}
                  </span>
                  <span className="px-2 truncate text-sm flex-grow">
                    {joinArrays(
                      String(id),
                      q,
                      "bg-black text-white px-0.5 rounded"
                    )}
                  </span>
                  <ManualModal
                    anchorClassName="flex items-center gap-2 px-2 py-1 cursor-pointer"
                    anchorContent={
                      <>
                        <MoreHorizOutlined fontSize="small" />
                      </>
                    }
                  >
                    <h3>Action details</h3>
                    <TableValues
                      transformKeys={(k) => snakeCaseToTitleCase(k)}
                      className="rounded text-sm"
                      values={{
                        id,
                        name,
                      }}
                      valueClassName="gap-2"
                      copy={{
                        fields: ["id", "name"],
                        copyContentProps: {
                          iconClassName: "p-0.5",
                          className:
                            "flex items-center border border-gray-500 text-gray-500 rounded",
                        },
                      }}
                    />
                  </ManualModal>
                </div>
              )}
            />
          </div>
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
                      <RequestErrorsWrapperNode
                        fallbackMessage="Could not count resource actions."
                        requestError={data}
                      />
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
                                    <KTooltip
                                      tooltipContainerClassName="shadow shadow-black/50 bg-white-100/10 backdrop-blur rounded overflow-hidden"
                                      tooltipContent={
                                        <>
                                          <EditModal
                                            title={<h3>Modify action name</h3>}
                                            className="grid gap-2"
                                            anchorClassName="flex items-center gap-2 px-2 py-1 cursor-pointer hover:text-white hover:bg-teal-800 duration-300"
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
                                            anchorClassName="flex items-center gap-2 px-2 py-1 cursor-pointer hover:text-white hover:bg-teal-800 duration-300"
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
                                            <TableValues
                                              transformKeys={(k) =>
                                                snakeCaseToTitleCase(k)
                                              }
                                              className="rounded text-sm"
                                              values={{
                                                id,
                                                name,
                                                created: `${new Date(
                                                  created_at
                                                ).toDateString()} at ${new Date(
                                                  created_at
                                                ).toLocaleTimeString()}`,
                                                last_updated: `${new Date(
                                                  updated_at
                                                ).toDateString()} at ${new Date(
                                                  updated_at
                                                ).toLocaleTimeString()}`,
                                              }}
                                              valueClassName="gap-2"
                                              copy={{
                                                fields: ["id", "name"],
                                                copyContentProps: {
                                                  iconClassName: "p-0.5",
                                                  className:
                                                    "flex items-center border border-gray-500 text-gray-500 rounded",
                                                },
                                              }}
                                            />
                                          </ManualModal>
                                          <DeleteModal
                                            passKey="delete action"
                                            anchorClassName="flex items-center gap-2 px-2 py-1 cursor-pointer  hover:text-white hover:bg-red-800 duration-300"
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
                                                if (res.status === "ok") {
                                                  refresh();
                                                  let rs: AlertResponse = {
                                                    status: "success",
                                                    message:
                                                      "Action deleted successfully.",
                                                  };
                                                  pushAlert(rs);
                                                  return rs;
                                                } else {
                                                  return {
                                                    status: "error",
                                                    message: (
                                                      <RequestErrorsWrapperNode
                                                        fallbackMessage="Could not delete action."
                                                        requestError={res}
                                                      />
                                                    ),
                                                  };
                                                }
                                              })
                                            }
                                          >
                                            <h3>
                                              You are about to delete this
                                              action
                                            </h3>
                                            <TableValues
                                              transformKeys={(k) =>
                                                snakeCaseToTitleCase(k)
                                              }
                                              className="rounded text-sm"
                                              values={{
                                                id,
                                                name,
                                                created: `${new Date(
                                                  created_at
                                                ).toDateString()} at ${new Date(
                                                  created_at
                                                ).toLocaleTimeString()}`,
                                                last_updated: `${new Date(
                                                  updated_at
                                                ).toDateString()} at ${new Date(
                                                  updated_at
                                                ).toLocaleTimeString()}`,
                                              }}
                                              valueClassName="gap-2"
                                              copy={{
                                                fields: ["id", "name"],
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
                  <RequestErrorsWrapperNode
                    fallbackMessage="Sorry!, could not fetch resource actions!"
                    requestError={data}
                  />
                </Alert>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
