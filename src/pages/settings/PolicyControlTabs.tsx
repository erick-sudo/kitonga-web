import KTabs from "../../ui/Tabs";
import { AccessPolicyList } from "./AccessPolicyList";
import { GroupList } from "./GroupList";
import { ResourceActionList } from "./ResourceActionList";
import { RoleList } from "./RoleList";

export default function PolicyControlTabs() {
  return (
    <div className="p-2">
      <KTabs
        items={[
          { label: <h4>Roles</h4>, panel: <RoleList /> },
          { label: <h4>Groups</h4>, panel: <GroupList /> },
          {
            label: <h4>Resource Actions</h4>,
            panel: <ResourceActionList />,
          },
          { label: <h4>Policies</h4>, panel: <AccessPolicyList /> },
        ]}
      />
    </div>
  );
}
