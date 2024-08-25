import { Route, Routes } from "react-router-dom";
import { CaseList } from "./CaseList";
import { CaseDetails } from "./CaseDetails";

export function Cases() {
  return (
    <div>
      <Routes>
        <Route path="" element={<CaseList />}></Route>
        <Route path="details/:caseId" element={<CaseDetails />} />
      </Routes>
    </div>
  );
}
