import "./App.css";
import { TANSTACK_QUERY_KEYS } from "./lib/KEYS";
import { TanstackSuspense } from "./ui/TanstackSuspense";
import { fetchCurrentUser } from "./lib/data";
import { DashboardContext } from "./context/DashboardContext";
import { Dashboard } from "./pages/Dashboard";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Signin } from "./ui/acc/Signin";
import { ForgotPassword } from "./ui/acc/ForgotPassword";
import NotSignedIn from "./ui/NotSignedIn";
// import "primereact/resources/themes/tailwind-light/theme.css";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard/*"
          element={
            <TanstackSuspense
              fallback={<div>Loading...</div>}
              queryKey={[TANSTACK_QUERY_KEYS.CURRENT_USER]}
              queryFn={fetchCurrentUser}
              RenderData={({ data }) => {
                const logout = () => {
                  console.log("Logged out.");
                };

                if (!data) {
                  return (
                    <div>
                      <NotSignedIn />
                    </div>
                  );
                }

                return (
                  <DashboardContext.Provider value={{ user: data, logout }}>
                    <Dashboard />
                  </DashboardContext.Provider>
                );
              }}
            />
          }
        />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}

export default App;
