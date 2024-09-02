import { Route, Routes } from "react-router-dom";
import { CaseList } from "./CaseList";
import { CaseDetails } from "./CaseDetails";
import NotFound from "../../ui/NotFound";

export function Cases() {
  return (
    <div>
      <Routes>
        <Route path="" element={<CaseList />}></Route>
        <Route path="details/:caseId" element={<CaseDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
