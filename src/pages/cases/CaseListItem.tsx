import { NavLink } from "react-router-dom";
import { Case } from "../../lib/definitions";
import { SimpleControlledAccordion } from "../../ui/accordions/SimpleControlledAccordion";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export function CaseListItem({
  casex: {
    id,
    title,
    status,
    description,
    case_no_or_parties,
    file_reference,
    clients_reference,
    record,
  },
}: {
  casex: Case;
}) {
  return (
    <SimpleControlledAccordion
      className="bg-white shadow-sm rounded"
      item={{
        summary: { title, status, id },
        details: {
          id,
          description,
          case_no_or_parties,
          file_reference,
          clients_reference,
          record,
        },
      }}
      Summary={({ summary: { title, status }, expanded }) => (
        <div className={`flex items-center w-full ${expanded ? "" : ""}`}>
          <h3 className="w-2/3">{title}</h3>
          <span className="w-1/3 grid px-4">
            <span title={status} className="truncate bg-teal-50 text-teal-900 px-2 py-1 rounded border border-teal-800/40 w-max justify-self-end text-xs">{status}</span>
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
        <div className={`${expanded ? "" : ""}`}>
          <div className="grid grid-cols-">
            <div className="flex items-start border-y py-1">
              <h4 className="min-w-44 max-w-44">Description</h4>
              <p className="flex-grow">{description}</p>
            </div>
            <div className="flex items-start border-b py-1">
              <h4 className="min-w-44 max-w-44">Case NO. or Parties</h4>
              <p className="flex-grow">{case_no_or_parties}</p>
            </div>
            <div className="flex items-start border-b py-1">
              <h4 className="min-w-44 max-w-44">File Reference</h4>
              <p className="flex-grow">{file_reference}</p>
            </div>
            <div className="flex items-start border-b py-1">
              <h4 className="min-w-44 max-w-44">Clients Reference</h4>
              <p className="flex-grow">{clients_reference}</p>
            </div>
            <div className="flex items-start border-b py-1">
              <h4 className="min-w-44 max-w-44">Record</h4>
              <p className="flex-grow">{record}</p>
            </div>
          </div>
          <div className="py-1">
            <NavLink
              className="bg-teal-800 w-max px-4 py-1 text-white rounded flex items-center gap-2 text-sm"
              to={`/dashboard/cases/${id}`}
            >
              <span>Edit</span> <PencilSquareIcon height={16} />
            </NavLink>
          </div>
        </div>
      )}
    />
  );
}
