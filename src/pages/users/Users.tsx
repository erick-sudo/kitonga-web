import { Route, Routes } from "react-router-dom";
import { UserList } from "./UserList";
import NotFound from "../../ui/NotFound";

export function Users() {
  return (
    <div>
      <Routes>
        <Route path="" element={<UserList />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
