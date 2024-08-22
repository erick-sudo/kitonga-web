import {
  ChevronRightIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import useAPI from "../../hooks/useAPI";
import { APIS } from "../../lib/apis";
import { axiosGet } from "../../lib/axiosLib";
import { Case } from "../../lib/definitions";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import { ControlledAccordions } from "../../ui/accordions/ControlledAccordions";
import { TanstackSuspense } from "../../ui/TanstackSuspense";
import { NavLink } from "react-router-dom";

export function CaseList() {
  const handleRequest = useAPI();

  return (
    <div>
      <TanstackSuspense
        queryKey={[TANSTACK_QUERY_KEYS.CASE_LIST]}
        queryFn={() =>
          handleRequest<Case[]>({
            func: axiosGet,
            args: [
              APIS.pagination.getCases
                .replace("<:page>", "1")
                .replace("<:size>", "20"),
            ],
          })
        }
        fallback={<div>Loading Cases...</div>}
        RenderData={({ data }) => {
          if (data.status !== "ok") {
          }

          return (
            <div className="grid gap-2 px-4 pb-4">
              {data.result ? (
                <ControlledAccordions
                  className="bg-white shadow-sm rounded"
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
                      <div className="py-1">
                        <NavLink
                          className="bg-teal-800 hover:bg-teal-700 duration-300 w-max px-4 py-1 text-gray-200 rounded flex items-center gap-2 text-sm"
                          to={`/dashboard/cases/${id}`}
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
