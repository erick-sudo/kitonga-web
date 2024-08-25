import {
  ChevronRightIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import useAPI from "../../hooks/useAPI";
import { APIS } from "../../lib/apis";
import { axiosGet } from "../../lib/axiosLib";
import { Case, Population } from "../../lib/definitions";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import { ControlledAccordions } from "../../ui/accordions/ControlledAccordions";
import {
  TanstackSuspense,
  TanstackSuspensePaginated,
} from "../../ui/TanstackSuspense";
import { NavLink } from "react-router-dom";
import { CaseListSkeleton } from "../../ui/Skeletons";
import { Alert, Pagination } from "@mui/material";
import InputSelection from "../../ui/InputSelection";
import { useState } from "react";
import { MUI_STYLES } from "../../lib/MUI_STYLES";

export function CaseList() {
  const handleRequest = useAPI();
  const [perPage, setPerPage] = useState<string | number>(10);

  return (
    <div className="px-4 pb-4 grid gap-2">
      <TanstackSuspensePaginated
        queryKey={[TANSTACK_QUERY_KEYS.CASE_LIST, perPage]}
        queryFn={(page: number) =>
          handleRequest<Case[]>({
            func: axiosGet,
            args: [
              APIS.pagination.getCases
                .replace("<:page>", `${page || 1}`)
                .replace("<:size>", String(perPage)),
            ],
          })
        }
        fallback={<CaseListSkeleton size={8} />}
        RenderPaginationIndicators={({ setNextPage }) => (
          <TanstackSuspense
            queryKey={[TANSTACK_QUERY_KEYS.CASE_COUNT]}
            queryFn={() =>
              handleRequest<Population>({
                func: axiosGet,
                args: [APIS.statistics.casesCount],
              })
            }
            RenderData={({ data }) => {
              if (data.status === "ok" && data.result) {
                const { count } = data.result;

                return (
                  <div className="p-2 shadow rounded bg-white flex items-center gap-4">
                    <InputSelection
                      value={perPage}
                      onChange={(newValue) => setPerPage(newValue)}
                      label="Cases per page"
                      name="cases_per_page"
                      options={[5, 10, 25, 50, 75, 100].map((p) => ({
                        name: p,
                        value: p,
                        level: 0,
                        type: "item",
                      }))}
                      sx={{
                        ...MUI_STYLES.FilledInputTextField3,
                        width: "8rem",
                      }}
                    />

                    <div className="flex-grow flex">
                      <Pagination
                        onChange={(_, page) => {
                          setNextPage(page);
                        }}
                        size="small"
                        count={Math.ceil(count / Number(perPage))}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div className="rounded overflow-hidden shadow-sm">
                  <Alert severity="warning">Could not count cases...</Alert>
                </div>
              );
            }}
          />
        )}
        RenderData={({ data }) => {
          if (data.status !== "ok") {
            return (
              <div className="rounded overflow-hidden shadow-sm">
                <Alert severity="warning">Could not fetch cases...</Alert>
              </div>
            );
          }

          return (
            <div className="grid gap-2">
              {data.result ? (
                <ControlledAccordions
                  className="shadow rounded bg-gray-50"
                  expandedClassName="bg-teal-900"
                  expand={{
                    ExpandIcon: ({ expanded }) => (
                      <ChevronRightIcon
                        className={`${
                          expanded ? "text-gray-200" : " text-teal-800"
                        }`}
                        height={16}
                      />
                    ),
                  }}
                  items={data.result.map(
                    ({
                      id,
                      title,
                      status,
                      description,
                      case_no_or_parties,
                      file_reference,
                      clients_reference,
                      record,
                    }) => ({
                      summary: { title, status, id },
                      details: {
                        id,
                        description,
                        case_no_or_parties,
                        file_reference,
                        clients_reference,
                        record,
                      },
                    })
                  )}
                  Summary={({ summary: { title, status }, expanded }) => (
                    <div
                      className={`flex items-center w-full duration-300 ${
                        expanded ? "text-gray-200" : ""
                      }`}
                    >
                      <h3 className="w-2/3 font-semibold">{title}</h3>
                      <span className="w-1/3 grid px-4">
                        <span
                          title={status}
                          className={`truncate border ${
                            expanded
                              ? "text-gray-200 border-gray-200/50"
                              : "bg-teal-50 text-teal-900 border-teal-800/40"
                          } px-2 py-1 rounded w-max justify-self-end text-xs`}
                        >
                          {status}
                        </span>
                      </span>
                    </div>
                  )}
                  Details={({
                    details: {
                      id,
                      description,
                      case_no_or_parties,
                      file_reference,
                      clients_reference,
                      record,
                    },
                    expanded,
                  }) => (
                    <div className={`${expanded ? "text-gray-200" : ""}`}>
                      <div className="grid grid-cols-">
                        <div className="flex items-start border-y border-gray-200/50 py-1">
                          <h4 className="min-w-44 max-w-44">Description</h4>
                          <p className="flex-grow">{description}</p>
                        </div>
                        <div className="flex items-start border-b border-gray-200/50 py-1">
                          <h4 className="min-w-44 max-w-44">
                            Case NO. or Parties
                          </h4>
                          <p className="flex-grow">{case_no_or_parties}</p>
                        </div>
                        <div className="flex items-start border-b border-gray-200/50 py-1">
                          <h4 className="min-w-44 max-w-44">File Reference</h4>
                          <p className="flex-grow">{file_reference}</p>
                        </div>
                        <div className="flex items-start border-b border-gray-200/50 py-1">
                          <h4 className="min-w-44 max-w-44">
                            Clients Reference
                          </h4>
                          <p className="flex-grow">{clients_reference}</p>
                        </div>
                        <div className="flex items-start border-b border-gray-200/50 py-1">
                          <h4 className="min-w-44 max-w-44">Record</h4>
                          <p className="flex-grow">{record}</p>
                        </div>
                      </div>
                      <div className="py-1 flex items-center gap-2">
                        <NavLink
                          className="bg-teal-800 hover:bg-teal-700 duration-300 w-max px-4 py-1 text-gray-200 rounded flex items-center gap-2 text-sm"
                          to={`/dashboard/cases/details/${id}`}
                        >
                          <span>See More</span> <ChevronRightIcon height={16} />
                        </NavLink>
                        <NavLink
                          className="bg-teal-800 hover:bg-teal-700 duration-300 w-max px-4 py-1 text-gray-200 rounded flex items-center gap-2 text-sm"
                          to={`/dashboard/cases/edit/${id}`}
                        >
                          <span>Edit</span> <PencilSquareIcon height={16} />
                        </NavLink>
                      </div>
                    </div>
                  )}
                />
              ) : (
                <div className="p-4 bg-white rounded shadow-sm">
                  No Cases Found...
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
