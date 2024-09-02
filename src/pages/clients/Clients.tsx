import { Route, Routes } from "react-router-dom";
import NotFound from "../../ui/NotFound";
import { ClientList } from "./ClientList";
import { ClientDetails } from "./ClientDetails";

export function Clients() {
  return (
    <div>
      <Routes>
        <Route path="" element={<ClientList />}></Route>
        <Route path="details/:clientId" element={<ClientDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
