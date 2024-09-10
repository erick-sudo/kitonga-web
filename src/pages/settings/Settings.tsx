import { Route, Routes } from "react-router-dom";
import PolicyControlTabs from "./PolicyControlTabs";
import { PolicyDetails } from "./PolicyDetails";
import NotFound from "../../ui/NotFound";
import { GroupDetails } from "./GroupDetails";

export function Settings() {
  return (
    <Routes>
      <Route path="" element={<PolicyControlTabs />} />
      <Route path="policies/details/:policyId" element={<PolicyDetails />} />
      <Route path="groups/details/:groupId" element={<GroupDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
