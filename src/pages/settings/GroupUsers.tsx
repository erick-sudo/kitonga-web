import { TanstackSuspense } from "../../ui/TanstackSuspense";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import useAPI from "../../hooks/useAPI";
import { axiosGet, axiosPost } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { Alert, Checkbox } from "@mui/material";
import { PolicyUser } from "../../lib/definitions";
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
import { AddUserToGroupForm } from "./AddUserToGroupForm";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";

export function GroupUsers({ groupId }: { groupId: string }) {
  const [deleting, setDeleting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<PolicyUser[]>([]);
  const queryClient = useQueryClient();
  const handleRequest = useAPI();
  const { pushAlert } = useContext(AlertContext);
  const groupUsersKey = `${TANSTACK_QUERY_KEYS.GROUP_DETAILS}#${groupId}#users`;
  const isSelected = (usr: PolicyUser) =>
    selectedUsers.some((u) => u.id === usr.id);

  const handleDelete: (ids: string[]) => Promise<DeleteResponse> = async (
    ids: string[]
  ) => {
    setDeleting(true);
    const res = await handleRequest<null>({
      func: axiosPost,
      args: [
        APIS.authorization.groups.removeUsers.replace("<:groupId>", groupId),
        { ids },
      ],
    });
    setDeleting(false);
    let rs: AlertResponse;
    if (res.status === "ok") {
      queryClient.invalidateQueries({
        queryKey: [groupUsersKey],
      });
      setSelectedUsers([]);
      rs = {
        status: "success",
        message: "Users removed successfully",
      };
    } else {
      rs = {
        status: "error",
        message: (
          <RequestErrorsWrapperNode
            fallbackMessage="An error occured while removing users. Please try again later"
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
        <span className="text-gray-600 text-sm font-semibold px-4 border-r border-b">
          Users
        </span>
        <button
          onClick={() =>
            handleDelete(selectedUsers.map((u) => u.id)).then((res) => {
              pushAlert(res, 10000);
            })
          }
          disabled={selectedUsers.length < 1}
          className="px-2 w-32 border flex items-center text-sm gap-2 rounded border-red-500 disabled:border-gray-300 text-red-500 disabled:cursor-not-allowed disabled:text-gray-400 hover:shadow duration-300"
        >
          <TrashIcon height={14} />
          {deleting ? "Removing..." : "Remove all"}
        </button>
      </h3>
      <TanstackSuspense
        fallback={<ClientListSkeleton />}
        queryKey={[groupUsersKey]}
        queryFn={() =>
          handleRequest<PolicyUser[]>({
            func: axiosGet,
            args: [
              APIS.authorization.groups.users.replace("<:groupId>", groupId),
            ],
          })
        }
        RenderData={({ data }) => {
          if (data.status === "ok" && data.result) {
            const users = data.result;

            return (
              <div className="grid gap-2">
                <div className="border rounded bg-white shadow overflow-hidden">
                  {users.length > 0 ? (
                    users.map((usr, index) => (
                      <div
                        key={index}
                        className="text-sm flex border-b last:border-none"
                      >
                        <Checkbox
                          size="small"
                          checked={isSelected(usr)}
                          sx={MUI_STYLES.CheckBox}
                          onChange={() => {
                            if (!isSelected(usr)) {
                              setSelectedUsers((p) => [...p, usr]);
                            } else {
                              setSelectedUsers((p) =>
                                p.filter((u) => u.id !== usr.id)
                              );
                            }
                          }}
                        />

                        <div className="flex-grow grid grid-cols-2">
                          <span className="px-4 py-2">{usr.username}</span>
                          <span className="px-4 py-2">{usr.email}</span>
                        </div>

                        <DeleteModal
                          passKey={`remove user - ${usr.username}`}
                          anchorClassName="p-2 hover:text-red-600 duration-300"
                          anchorContent={
                            <>
                              <TrashIcon height={18} />
                            </>
                          }
                          onSubmit={() => handleDelete([usr.id])}
                        >
                          <h3>
                            You are about to remove&nbsp;
                            {usr.username}&nbsp;from this group.
                          </h3>
                        </DeleteModal>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2">No users in this group yet.</div>
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
                      <AddUserToGroupForm groupId={groupId} users={users} />
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
                  fallbackMessage="Could not fetch group's users!"
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
