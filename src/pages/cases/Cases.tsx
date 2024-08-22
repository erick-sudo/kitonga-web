import { Route, Routes } from "react-router-dom";
import { CaseList } from "./CaseList";

export function Cases() {
  return (
    <div>
      <Routes>
        <Route path="" element={<CaseList />}></Route>
      </Routes>
    </div>
  );
}
