import { TanstackSuspense } from "../../ui/TanstackSuspense";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import useAPI from "../../hooks/useAPI";
import { axiosGet, axiosPost } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { Alert, Checkbox } from "@mui/material";
import { Role } from "../../lib/definitions";
import { ClientListSkeleton } from "../../ui/Skeletons";
import KDrawer from "../../ui/drawers/KDrawer";
import { Add } from "@mui/icons-material";
import { ChevronLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { AlertResponse, DeleteResponse } from "../../ui/definitions";
import { useQueryClient } from "@tanstack/react-query";
import DeleteModal from "../../ui/modals/DeleteModal";
import { AlertContext } from "../Dashboard";
import { AddRoleForm } from "./AddRoleForm";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";

export function GroupRoles({ groupId }: { groupId: string }) {
  const [deleting, setDeleting] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const queryClient = useQueryClient();
  const handleRequest = useAPI();
  const { pushAlert } = useContext(AlertContext);
  const groupRolesKey = `${TANSTACK_QUERY_KEYS.GROUP_DETAILS}#${groupId}#roles`;
  const isSelected = (role: Role) =>
    selectedRoles.some((r) => r.id === role.id);

  const handleDelete: (ids: string[]) => Promise<DeleteResponse> = async (
    ids: string[]
  ) => {
    setDeleting(true);
    const res = await handleRequest<null>({
      func: axiosPost,
      args: [
        APIS.authorization.groups.removeRoles.replace("<:groupId>", groupId),
        { ids },
      ],
    });
    setDeleting(false);
    let rs: AlertResponse;
    if (res.status === "ok") {
      queryClient.invalidateQueries({
        queryKey: [groupRolesKey],
      });
      setSelectedRoles([]);
      rs = {
        status: "success",
        message: "Roles removed successfully",
      };
    } else {
      rs = {
        status: "error",
        message: (
          <RequestErrorsWrapperNode
            fallbackMessage="An error occured while removing roles. Please try again later."
            requestError={res}
          />
        ),
      };
    }
    pushAlert(rs);
    return rs;
  };

  return (
    <div className=" grid gap-2">
      <h3 className="flex justify-between">
        <span className="text-gray-600 text-sm font-semibold border-r px-4 border-b">
          Roles
        </span>
        <button
          onClick={() =>
            handleDelete(selectedRoles.map((r) => r.id)).then((res) => {
              pushAlert(res, 10000);
            })
          }
          disabled={selectedRoles.length < 1}
          className="px-2 w-32 border flex items-center text-sm gap-2 rounded border-red-500 disabled:border-gray-300 text-red-500 disabled:cursor-not-allowed disabled:text-gray-400 hover:shadow duration-300"
        >
          <TrashIcon height={14} />
          {deleting ? "Removing..." : "Remove all"}
        </button>
      </h3>
      <TanstackSuspense
        fallback={<ClientListSkeleton />}
        queryKey={[groupRolesKey]}
        queryFn={() =>
          handleRequest<Role[]>({
            func: axiosGet,
            args: [
              APIS.authorization.groups.roles.replace("<:groupId>", groupId),
            ],
          })
        }
        RenderData={({ data }) => {
          if (data.status === "ok" && data.result) {
            const roles = data.result;

            return (
              <div className="grid gap-2">
                <div className="border rounded bg-white shadow overflow-hidden">
                  {roles.length > 0 ? (
                    roles.map((role, index) => (
                      <div
                        key={index}
                        className="text-sm flex border-b last:border-none"
                      >
                        <Checkbox
                          size="small"
                          checked={isSelected(role)}
                          sx={MUI_STYLES.CheckBox}
                          onChange={() => {
                            if (!isSelected(role)) {
                              setSelectedRoles((p) => [...p, role]);
                            } else {
                              setSelectedRoles((p) =>
                                p.filter((r) => r.id !== role.id)
                              );
                            }
                          }}
                        />
                        <span className="grow px-4 py-2">{role.name}</span>
                        <DeleteModal
                          passKey="remove role"
                          anchorClassName="p-2 hover:text-red-600 duration-300"
                          anchorContent={
                            <>
                              <TrashIcon height={18} />
                            </>
                          }
                          onSubmit={() => handleDelete([role.id])}
                        >
                          <h3>
                            You are about to remove&nbsp;
                            {role.name.split("_")[1]}&nbsp;role from this group.
                          </h3>
                        </DeleteModal>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2">No roles in this group yet.</div>
                  )}
                </div>
                <div className="flex justify-end">
                  <KDrawer
                    collapseClassName="border-l-2 border-y-2 rounded-l py-4 bg-white hover:text-white hover:bg-teal-800 duration-300 hover:border-teal-800"
                    collapseContent={
                      <>
                        <ChevronLeftIcon height={20} />
                      </>
                    }
                    anchorContent={
                      <>
                        <Add />
                      </>
                    }
                    anchorClassName="bg-teal-600 h-8 w-8 text-white flex items-center justify-center rounded shadow-sm shadow-black hover:shadow-md hover:shadow-black hover:scale-105 duration-300"
                  >
                    <div className="p-2">
                      <AddRoleForm groupId={groupId} roles={roles} />
                    </div>
                  </KDrawer>
                </div>
              </div>
            );
          }

          return (
            <div className="rounded border shadow overflow-hidden">
              <Alert severity="error">
                <RequestErrorsWrapperNode
                  fallbackMessage="Could not fetch group's roles!"
                  requestError={data}
                />
              </Alert>
            </div>
          );
        }}
      />
    </div>
  );
}
