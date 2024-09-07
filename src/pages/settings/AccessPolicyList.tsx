import { Alert, Pagination, Tooltip } from "@mui/material";
import useAPI from "../../hooks/useAPI";
import { APIS } from "../../lib/apis";
import { axiosDelete, axiosGet } from "../../lib/axiosLib";
import { AccessPolicy, Population } from "../../lib/definitions";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import {
  TanstackSuspense,
  TanstackSuspensePaginated,
} from "../../ui/TanstackSuspense";
import KDrawer from "../../ui/drawers/KDrawer";
import {
  ChevronRightIcon,
  TrashIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import { Add, More } from "@mui/icons-material";
import { insertQueryParams } from "../../lib/utils";
import usePagination from "../../hooks/usePagination";
import InputSelection from "../../ui/InputSelection";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { useQueryClient } from "@tanstack/react-query";
import { BuildNewPolicyForm } from "./BuildNewPolicyForm";
import { ClientListSkeleton } from "../../ui/Skeletons";
import { NavLink } from "react-router-dom";
import DeleteModal from "../../ui/modals/DeleteModal";

export function AccessPolicyList() {
  const queryClient = useQueryClient();
  const handleRequest = useAPI();
  const { currentPage, itemsPerPage, setNextPage, setNumberOfItemsPerPage } =
    usePagination({
      initialPage: 1,
    });
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
                <span>Build a new policy</span>
              </>
            }
          >
            <div className="p-2 max-w-xl">
              <BuildNewPolicyForm
                onNewRecord={() => {
                  setNextPage(1);
                  queryClient.invalidateQueries({
                    queryKey: [
                      TANSTACK_QUERY_KEYS.ACCESS_POLICY_COUNT,
                      itemsPerPage,
                      currentPage,
                    ],
                  });
                  queryClient.invalidateQueries({
                    queryKey: [
                      TANSTACK_QUERY_KEYS.ACCESS_POLICY_LIST,
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
          fallback={<ClientListSkeleton />}
          currentPage={currentPage}
          RenderPaginationIndicators={({ currentPage }) => (
            <TanstackSuspense
              queryKey={[
                TANSTACK_QUERY_KEYS.ACCESS_POLICY_COUNT,
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
                      APIS.authorization.accessPolicies.count,
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
                        label="Policies per page"
                        name="policies_per_page"
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
                  <div className="rounded overflow-hidden shadow border">
                    <Alert severity="warning">
                      Could not count access policies...
                    </Alert>
                  </div>
                );
              }}
            />
          )}
          queryKey={[
            TANSTACK_QUERY_KEYS.ACCESS_POLICY_LIST,
            itemsPerPage,
            currentPage,
          ]}
          queryFn={() => {
            const params: Record<string, string | number> = {
              page_number: currentPage,
              page_population: itemsPerPage,
            };

            return handleRequest<AccessPolicy[]>({
              func: axiosGet,
              args: [
                insertQueryParams(
                  APIS.authorization.accessPolicies.index,
                  params
                ),
              ],
            });
          }}
          RenderData={({ data }) => {
            if (data.status === "ok" && data.result) {
              const accessPolicies = data.result;
              return (
                <>
                  {accessPolicies.length > 0 ? (
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
                            {accessPolicies.map(
                              (
                                { id, name, description, created_at },
                                index
                              ) => (
                                <tr key={index} className="border-t">
                                  <td className="px-4 py-1">{name}</td>
                                  <td className="px-4 py-1">
                                    {new Date(created_at).toDateString()}
                                  </td>
                                  <td className="pr-2 flex justify-end">
                                    <Tooltip
                                      title={
                                        <div>
                                          <NavLink
                                            to={`/dashboard/policies/details/${id}`}
                                            className="flex items-center gap-2 px-2 py-1"
                                          >
                                            <ViewfinderCircleIcon height={16} />
                                            <span>See More</span>
                                          </NavLink>
                                          <DeleteModal
                                            passKey="delete policy"
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
                                                  APIS.authorization.accessPolicies.destroy.replace(
                                                    "<:policyId>",
                                                    id
                                                  ),
                                                ],
                                              }).then((res) => {
                                                queryClient.invalidateQueries({
                                                  queryKey: [
                                                    TANSTACK_QUERY_KEYS.ACCESS_POLICY_LIST,

                                                    itemsPerPage,
                                                    currentPage,
                                                  ],
                                                });
                                                if (res.status === "ok") {
                                                  return {
                                                    status: "success",
                                                    message:
                                                      "Access policy deleted successfully.",
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
                                              access policy
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
                                              <div className="border-t flex items-start">
                                                <span className="w-24 px-4 py-1 border-r">
                                                  Description
                                                </span>
                                                <span className="flex-grow px-4 py-1">
                                                  {description}
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
                  Sorry!, could not fetch access policies!
                </Alert>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
