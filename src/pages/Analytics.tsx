import { Alert } from "@mui/material";
import useAPI from "../hooks/useAPI";
import { APIS } from "../lib/apis";
import { axiosGet } from "../lib/axiosLib";
import { TANSTACK_QUERY_KEYS } from "../lib/KEYS";
import { ClientDetailsSkeleton } from "../ui/Skeletons";
import { TanstackSuspense } from "../ui/TanstackSuspense";
import { RecentCase } from "../lib/definitions";
import { NavLink } from "react-router-dom";
import {
  ChevronDoubleRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { capitalize } from "../lib/utils";
import {
  ApacheEChart,
  areaChartOptions,
  pieChartOptions,
} from "../ui/ApacheEChart";

export function Analytics() {
  return (
    <div className="p-2 grid gap-2">
      <div>
        <Counts />
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <div className="grid">
          <CasesPerClientTally />
        </div>
        <div className="grid">
          <AllCasesTally />
        </div>
      </div>
      <div className="grid">
        <SixMostRecentCases />
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
            <div className="grid bg-white rounded border shadow p-4">
              <h3 className="font-bold text-center">Cases tally per client</h3>
              <ApacheEChart
                options={pieChartOptions({
                  legendPosition: "center",
                  title: "",
                  series: [
                    {
                      name: "Number of cases",
                      radius: "60%",
                      data: recentCases.map((k) => ({
                        name: k.name,
                        value: k.cases,
                      })),
                    },
                  ],
                })}
                className="min-h-96 border zero-size-horizontal-scrollbar"
              />
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
              <h3 className="pl-4 py-2 font-semibold flex items-center justify-between">
                <span>Most recent cases</span>
                <NavLink to="/dashboard/cases" className="flex items-center text-teal-600 hover:text-teal-800 duration-300">
                  <span>More</span>
                  <EllipsisVerticalIcon height={20} />
                </NavLink>
              </h3>
              <div className="grid">
                <div
                  key="header"
                  className="flex gap-2 items-center border-t py-1.5 font-semibold"
                >
                  <div className="grid grid-cols-5 flex-grow">
                    <span className="col-span-2 truncate px-4 border-r">
                      Title
                    </span>
                    <span className="truncate px-4 border-r">Status</span>
                    <span className="px-4 border-r">Created</span>
                    <span className="px-4 border-r">Record</span>
                  </div>
                  <div className="min-w-6 max-w-6 h-6"></div>
                </div>
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
                        className="border min-w-6 max-w-6 h-6 flex items-center justify-center text-gray-300 rounded hover:text-teal-700 hover:border-teal-700 duration-300"
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
                <div
                  key={index}
                  className="flex bg-white rounded border shadow py-2 gap-2"
                >
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

          const statuses = Object.entries(tally).map(([k]) => k);

          return (
            <div className="bg-white rounded border shadow p-4 zero-size-horizontal-scrollbar">
              <ApacheEChart
                options={areaChartOptions({
                  title: "Cases tally by status",
                  xAxisLabels: statuses,
                  series: [
                    {
                      name: "Number of cases",
                      color: "teal",
                      data: statuses.map((k) => tally[k]),
                    },
                  ],
                })}
                className="min-h-96 border grid"
              />
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
