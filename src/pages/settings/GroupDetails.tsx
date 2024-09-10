import { useParams } from "react-router-dom";
import { GroupInfo } from "./GroupInfo";
import { GroupRoles } from "./GroupRoles";
import { GroupUsers } from "./GroupUsers";

export function GroupDetails() {
  const { groupId } = useParams();
  const groupIdString = String(groupId);

  return (
    <div className="grid">
      <div>
        <div className="p-2 border-b">
          <GroupInfo groupId={groupIdString} />
        </div>
        <div className="p-2 border-b">
          <GroupRoles groupId={groupIdString} />
        </div>
        <div className="p-2">
          <GroupUsers groupId={groupIdString} />
        </div>
      </div>
    </div>
  );
}
