import { TanstackSuspense } from "../../ui/TanstackSuspense";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import useAPI from "../../hooks/useAPI";
import { axiosGet } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { Alert } from "@mui/material";
import { Group } from "../../lib/definitions";
import { ClientDetailsSkeleton } from "../../ui/Skeletons";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";

export function GroupInfo({ groupId }: { groupId: string }) {
  const handleRequest = useAPI();
  const groupKey = `${TANSTACK_QUERY_KEYS.GROUP_DETAILS}#${groupId}`;
  return (
    <TanstackSuspense
      fallback={<ClientDetailsSkeleton />}
      queryKey={[groupKey]}
      queryFn={() =>
        handleRequest<Group>({
          func: axiosGet,
          args: [APIS.authorization.groups.show.replace("<:groupId>", groupId)],
        })
      }
      RenderData={({ data }) => {
        if (data.status === "ok" && data.result) {
          const group = data.result;

          return (
            <div className="flex justify-between">
              <span className="text-teal-800">{group.name}</span>
              <span className="text-sm text-gray-600">
                {new Date(group.created_at).toDateString()}
              </span>
            </div>
          );
        }

        return (
          <div className="rounded border shadow overflow-hidden">
            <Alert severity="error">
              <RequestErrorsWrapperNode
                fallbackMessage="Could not fetch group info!"
                requestError={data}
              />
            </Alert>
          </div>
        );
      }}
    />
  );
}
