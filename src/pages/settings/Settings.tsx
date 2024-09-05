import useAPI from "../../hooks/useAPI";
import KTabs from "../../ui/Tabs";
import { AccessPolicyList } from "./AccessPolicyList";
import { ResourceActionList } from "./ResourceActionList";

export function Settings() {
  const handleRequest = useAPI();

  return (
    <div className="p-2">
      <KTabs
        items={[
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
