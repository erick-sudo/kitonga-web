import { Alert } from "@mui/material";
import useAPI from "../hooks/useAPI";
import { APIS } from "../lib/apis";
import { axiosGet } from "../lib/axiosLib";
import { TANSTACK_QUERY_KEYS } from "../lib/KEYS";
import { ClientDetailsSkeleton } from "../ui/Skeletons";
import { TanstackSuspense } from "../ui/TanstackSuspense";
import { RecentCase } from "../lib/definitions";
import { NavLink } from "react-router-dom";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { capitalize } from "../lib/utils";

export function Analytics() {
  return (
    <div className="px-4 grid gap-2">
      <div>
        <Counts />
      </div>
      <div>
        <SixMostRecentCases />
      </div>
      <div>
        <CasesPerClientTally />
      </div>
      <div>
        <AllCasesTally />
      </div>
    </div>
  );
}

function CasesPerClientTally() {
  const handleRequest = useAPI();
  return (
    <TanstackSuspense
      fallback={<ClientDetailsSkeleton />}
      queryKey={[TANSTACK_QUERY_KEYS.CASES_PER_CLIENT_TALLy]}
      queryFn={() =>
        handleRequest<{ name: string; cases: number }[]>({
          func: axiosGet,
          args: [APIS.dash.getCasesPerClient],
        })
      }
      RenderData={({ data }) => {
        if (data.status === "ok" && data.result) {
          const recentCases = data.result;

          return (
            <div className="grid">
              {recentCases.map(({ name, cases }, index) => (
                <div key={index} className="flex">
                  <span className="">{name}</span>
                  <span className="">{cases}</span>
                </div>
              ))}
            </div>
          );
        }

        // Could not fetch recent cases
        return (
          <div className="shadow rounded mt-2">
            <Alert severity="error">
              <span className="block">{data.errors?.status}</span>
              <span className="block">{data.errors?.error}</span>
            </Alert>
          </div>
        );
      }}
    />
  );
}

function SixMostRecentCases() {
  const handleRequest = useAPI();
  return (
    <TanstackSuspense
      fallback={<ClientDetailsSkeleton />}
      queryKey={[TANSTACK_QUERY_KEYS.SIX_MOST_RECENT_CASES]}
      queryFn={() =>
        handleRequest<RecentCase[]>({
          func: axiosGet,
          args: [APIS.dash.getFirst6MostRecentCases],
        })
      }
      RenderData={({ data }) => {
        if (data.status === "ok" && data.result) {
          const recentCases = data.result;

          return (
            <div className="bg-white p-2 rounded border shadow">
              <h3 className="px-4 py-2 font-semibold">Most recent cases</h3>
              <div className="grid">
                {recentCases.map(
                  ({ id, title, status, created_at, record }, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-center border-t py-1.5"
                    >
                      <div className="grid grid-cols-5 flex-grow">
                        <span className="col-span-2 truncate px-4 border-r">
                          {title}
                        </span>
                        <span className="truncate px-4 border-r">{status}</span>
                        <span className="px-4 border-r">
                          {new Date(created_at).toLocaleDateString()}
                        </span>
                        <span className="px-4 border-r">{record}</span>
                      </div>
                      <NavLink
                        className="border p-1 text-gray-300 rounded hover:text-teal-700 hover:border-teal-700 duration-300"
                        to={`/dashboard/cases/details/${id}`}
                      >
                        <ChevronDoubleRightIcon height={16} />
                      </NavLink>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        }

        // Could not fetch recent cases
        return (
          <div className="shadow rounded mt-2">
            <Alert severity="error">
              <span className="block">{data.errors?.status}</span>
              <span className="block">{data.errors?.error}</span>
            </Alert>
          </div>
        );
      }}
    />
  );
}

function Counts() {
  const handleRequest = useAPI();
  return (
    <TanstackSuspense
      fallback={<ClientDetailsSkeleton />}
      queryKey={[TANSTACK_QUERY_KEYS.DASH_COUNTS]}
      queryFn={() =>
        handleRequest<Record<string, number>>({
          func: axiosGet,
          args: [APIS.dash.getDashCounts],
        })
      }
      RenderData={({ data }) => {
        if (data.status === "ok" && data.result) {
          const tally = data.result;

          return (
            <div className="grid sm:grid-cols-3 gap-2">
              {Object.entries(tally).map(([k, v], index) => (
                <div key={index} className="flex bg-white rounded border shadow py-2 gap-2">
                  <span className="w-24 px-4 border-r">{capitalize(k)}</span>
                  <span className="px-4 font-semibold text-sm">{v}</span>
                </div>
              ))}
            </div>
          );
        }

        // Could not tally all cases
        return (
          <div className="shadow rounded mt-2">
            <Alert severity="error">
              <span className="block">{data.errors?.status}</span>
              <span className="block">{data.errors?.error}</span>
            </Alert>
          </div>
        );
      }}
    />
  );
}

function AllCasesTally() {
  const handleRequest = useAPI();
  return (
    <TanstackSuspense
      fallback={<ClientDetailsSkeleton />}
      queryKey={[TANSTACK_QUERY_KEYS.ALL_CASES_TALLY_BY_STATUS]}
      queryFn={() =>
        handleRequest<Record<string, number>>({
          func: axiosGet,
          args: [APIS.dash.tallyCasesByStatus],
        })
      }
      RenderData={({ data }) => {
        if (data.status === "ok" && data.result) {
          const tally = data.result;

          return (
            <div className="grid">
              {Object.entries(tally).map(([k, v], index) => (
                <div key={index} className="flex">
                  <span className="w-56 px-4 py-1">{k}</span>
                  <span className="flex-grow px-4 py-1">{v}</span>
                </div>
              ))}
            </div>
          );
        }

        // Could not tally all cases
        return (
          <div className="shadow rounded mt-2">
            <Alert severity="error">
              <span className="block">{data.errors?.status}</span>
              <span className="block">{data.errors?.error}</span>
            </Alert>
          </div>
        );
      }}
    />
  );
}
