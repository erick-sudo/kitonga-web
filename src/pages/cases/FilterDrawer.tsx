import { useContext, useEffect, useState } from "react";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import {
  Alert,
  Checkbox,
  Drawer,
  IconButton,
  Pagination,
  Radio,
  Switch,
} from "@mui/material";
import { Close, Download } from "@mui/icons-material";
import {
  array2d,
  csvString,
  insertQueryParams,
  joinArrays,
  snakeCaseToTitleCase,
} from "../../lib/utils";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../hooks/useAPI";
import { axiosGet, axiosPost } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { CheckCircleIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { ReactState } from "../../ui/definitions";
import { filterFields } from "../../lib/data";
import usePagination from "../../hooks/usePagination";
import KTabs from "../../ui/Tabs";
import * as XLSX from "xlsx";
import InputSelection from "../../ui/InputSelection";
import { LazySearch } from "../../ui/Search";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";
import { AlertContext } from "../Dashboard";
import { PolicyClient, Population } from "../../lib/definitions";

export type FilterCriteria = "match" | "strict";

const exportFormats = [
  { name: "excel", icon: <FaceSmileIcon height={24} />, ext: ".xlsx" },
  {
    name: "csv",
    icon: <FaceSmileIcon height={24} />,
    ext: ".csv",
  },
];

const dateFields = ["created_at", "updated_at"];

const fillRanges = (p: Record<string, (string | number)[]>) =>
  Object.entries(p).reduce(
    (acc: Record<string, (string | number)[]>, [k, v]) => {
      if (v.length > 0) {
        const ranges = [];
        if (dateFields.includes(k)) {
          ranges.push(v[0] || new Date(1).toLocaleDateString());
          ranges.push(v[1] || new Date().toLocaleDateString());
        } else {
          ranges.push(Number(v[0]) || 0);
          if (Number(v[1])) {
            ranges.push(Number(v[1]));
          }
        }
        acc[k] = ranges;
      }
      return acc;
    },
    {}
  );

const handleCsv = (
  data: Record<string, string | number>[],
  columns: string[]
) => {
  return URL.createObjectURL(
    new Blob([csvString(data, columns)], { type: "text/csv" })
  );
};

const handleExcel = (
  data: Record<string, string | number>[],
  columns: string[]
) => {
  const workSheet = XLSX.utils.aoa_to_sheet(array2d(data, columns));
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");

  const xlsxData = XLSX.write(workBook, { bookType: "xlsx", type: "array" });

  const blob = new Blob([xlsxData], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return URL.createObjectURL(blob);
};

export default function FilterDrawer({
  anchorClassName,
  anchorContent,
  state: [open, setOpen] = useState(false),
}: {
  anchorClassName?: string;
  anchorContent?: React.ReactNode;
  children?: React.ReactNode;
  state?: ReactState<boolean>;
}) {
  const [selectedClient, setSelectedClient] = useState<PolicyClient | null>(
    null
  );
  const [filterType, setFilterType] = useState<"single" | "range">("single");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [results, setResults] = useState<Record<string, string | number>[]>([]);
  const [filtering, setFiltering] = useState(false);
  const [criteria, setCriteria] = useState<FilterCriteria>("match");
  const [requestColumns, setRequestColumns] = useState<
    Record<"case" | "payment_information", string[]>
  >({ case: [], payment_information: [] });
  const [responseColumns, setResponseColumns] = useState<
    Record<"case" | "payment_information", string[]>
  >({ case: [], payment_information: [] });
  const [requestPayload, setRequestPayload] = useState<
    Record<"case" | "payment_information", Record<string, string>>
  >({ case: {}, payment_information: {} });
  const [rangePayload, setRangePayload] = useState<
    Record<"case" | "payment_information", Record<string, (string | number)[]>>
  >({ case: {}, payment_information: {} });
  const handleRequest = useAPI();
  const { currentPage, setNextPage, setNumberOfItemsPerPage, itemsPerPage } =
    usePagination();
  const [dataUrl, setDataUrl] = useState("");
  const [exportFormat, setExportFormat] = useState({
    name: "excel",
    icon: <FaceSmileIcon height={24} />,
    ext: ".xlsx",
  });
  const { pushAlert } = useContext(AlertContext);
  const [count, setCount] = useState<Population>({ count: 0 });

  const noResponseColumns = () =>
    responseColumns.case.length < 1 &&
    responseColumns.payment_information.length < 1;

  const allResponseColumns = () =>
    filterType === "range" && noResponseColumns()
      ? filterFields.matchColumns.case
      : [...responseColumns.case, ...responseColumns.payment_information];

  const handleExport = () => {
    if (exportFormat.name === "csv") {
      setDataUrl(handleCsv(results, allResponseColumns()));
    } else {
      setDataUrl(handleExcel(results, allResponseColumns()));
    }
  };

  const sanitizedRanges = () => ({
    case: fillRanges(rangePayload.case),
    payment_information: fillRanges(rangePayload.payment_information),
  });

  const emptyRequestPayloadFields = () =>
    requestColumns.case.some((col) => !!!requestPayload.case[col]) ||
    requestColumns.payment_information.some(
      (col) => !!!requestPayload.payment_information[col]
    );

  const canApply = () => {
    if (filterType === "range") {
      return !(
        requestColumns.case.length < 1 &&
        requestColumns.payment_information.length < 1
      );
    }

    return !(
      (requestColumns.case.length < 1 &&
        requestColumns.payment_information.length < 1) ||
      (responseColumns.case.length < 1 &&
        responseColumns.payment_information.length < 1) ||
      emptyRequestPayloadFields()
    );
  };

  const handleSubmit = (response: "count" | "data") => {
    setFiltering(true);
    const payload = {
      ...(filterType === "single"
        ? {
            match_columns: {
              ...(Object.entries(requestPayload.case).length > 0
                ? { case: requestPayload.case }
                : {}),
              ...(Object.entries(requestPayload.payment_information).length > 0
                ? { payment_information: requestPayload.payment_information }
                : {}),
            },
          }
        : {
            per_column_range_filter_params: {
              parameter: sanitizedRanges(),
            },
          }),
      response_columns: {
        ...(responseColumns.case.length > 0
          ? { case: responseColumns.case }
          : {}),
        ...(responseColumns.payment_information.length > 0
          ? { payment_information: responseColumns.payment_information }
          : {}),
      },
    };

    handleRequest<Record<string, string | number>[] | Population>({
      func: axiosPost,
      args: [
        insertQueryParams(
          filterType === "single"
            ? APIS.filter.casesFilter
            : APIS.filter.caseRangeFilter,
          {
            criteria,
            page_number: currentPage,
            page_population: itemsPerPage,
            response,
          }
        ),
        payload,
      ],
    })
      .then((res) => {
        if (res.status === "ok" && res.result) {
          if (response === "data" && Array.isArray(res.result)) {
            setResults(res.result);
          } else {
            setCount(res.result as Population);
          }
        } else {
          pushAlert({
            status: "error",
            message: <RequestErrorsWrapperNode requestError={res} />,
          });
        }
      })
      .finally(() => setFiltering(false));
  };

  useEffect(() => {
    if (canApply()) {
      handleSubmit("data");
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (results.length && canApply()) {
      handleSubmit("count");
    }
  }, [results]);

  return (
    <>
      <div className={anchorClassName} onClick={handleOpen}>
        {anchorContent}
      </div>
      <Drawer
        PaperProps={{
          className: "p-2 vertical-scrollbar",
          sx: {
            backgroundColor: "rgb(243 244 246)",
          },
        }}
        anchor="left"
        open={open}
      >
        <div className="grid gap-2 pb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Tune your filters</h3>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
          <div className="grid gap-2">
            <div className="">
              <div className="grid gap-2">
                {/* Flexibility */}
                <div className="bg-white p-2 rounded shadow">
                  <h3>Flexibility of filter</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Radio
                        size="small"
                        checked={criteria === "match"}
                        onChange={(_e) => setCriteria("match")}
                        sx={MUI_STYLES.CheckBox}
                      />
                      <span>Match</span>
                    </div>
                    <div className="flex items-center">
                      <Radio
                        size="small"
                        checked={criteria === "strict"}
                        onChange={(_e) => setCriteria("strict")}
                        sx={MUI_STYLES.CheckBox}
                      />
                      <span>Strict</span>
                    </div>
                  </div>
                </div>
                <h4 className=" text-justify">
                  Check which attributes to use for filtering and the ones you
                  would like to be included in the filter results.
                </h4>

                <div>
                  <div className="flex gap-2 flex-wrap items-center">
                    <div>Choose fields to filter against:</div>
                    <div
                      className={`border rounded-full flex items-center gap-2 px-2 duration-300 ${
                        filterType === "range"
                          ? "border-teal-800 bg-teal-50"
                          : "bg-white"
                      }`}
                    >
                      <Switch
                        checked={filterType === "range"}
                        onChange={(_, checked) => {
                          if (checked) {
                            setFilterType("range");

                            setRequestPayload({
                              case: {},
                              payment_information: {},
                            });
                          } else {
                            setFilterType("single");
                            setRangePayload({
                              case: {},
                              payment_information: {},
                            });
                          }
                          setRequestColumns({
                            case: [],
                            payment_information: [],
                          });
                        }}
                        size="small"
                        sx={MUI_STYLES.Switch}
                      />
                      <span className="text-sm">Use Ranges</span>
                    </div>
                  </div>
                  <KTabs
                    items={[
                      ...(filterType === "single"
                        ? [
                            {
                              label: (
                                <h4 className={`relative`}>
                                  <span>Case</span>
                                  {!!requestColumns.case.length && (
                                    <span className="absolute bottom-full bg-teal-800 text-xs text-white self-start h-4 w-4 rounded-full items-center justify-center">
                                      {requestColumns.case.length}
                                    </span>
                                  )}
                                </h4>
                              ),
                              panel: (
                                <div className="grid gap-2 md:grid-cols-2 vertical-scrollbar p-2 border rounded max-h-48 bg-gray-50/75 shadow">
                                  <div className="grid">
                                    <div className="flex items-center">
                                      <Checkbox
                                        checked={requestColumns.case.includes(
                                          "client_id"
                                        )}
                                        onChange={(_, checked) => {
                                          if (
                                            checked &&
                                            !requestColumns.case.includes(
                                              "client_id"
                                            )
                                          ) {
                                            setRequestColumns((p) => ({
                                              ...p,
                                              case: [...p.case, "client_id"],
                                            }));
                                          } else {
                                            setRequestColumns((p) => ({
                                              ...p,
                                              case: p.case.filter(
                                                (k) => k !== "client_id"
                                              ),
                                            }));
                                            delete requestPayload.case[
                                              "client_id"
                                            ];
                                            setSelectedClient(null);
                                          }
                                        }}
                                        size="small"
                                        sx={MUI_STYLES.CheckBox}
                                      />
                                      <div className="">
                                        {selectedClient
                                          ? selectedClient.name
                                          : "Select client"}
                                      </div>
                                    </div>

                                    <LazySearch
                                      disabled={
                                        !requestColumns.case.includes(
                                          "client_id"
                                        )
                                      }
                                      containerClassName="h-10 flex-grow"
                                      zIndex={20}
                                      viewPortClassName="max-h-36 vertical-scrollbar"
                                      className="border bg-white shadow w-full rounded"
                                      fetchItems={(q: string) =>
                                        handleRequest<PolicyClient[]>({
                                          func: axiosGet,
                                          args: [
                                            insertQueryParams(
                                              APIS.clients.searchAllClients,
                                              { q }
                                            ),
                                          ],
                                        }).then((res) => {
                                          if (
                                            res.status === "ok" &&
                                            res.result
                                          ) {
                                            return res.result;
                                          }
                                          return [];
                                        })
                                      }
                                      RenderItem={({
                                        q,
                                        item: { id, name, username, email },
                                      }) => (
                                        <div
                                          onClick={() => {
                                            setRequestPayload((p) => ({
                                              ...p,
                                              case: {
                                                ...p.case,
                                                client_id: id,
                                              },
                                            }));
                                            setSelectedClient({
                                              id,
                                              name,
                                              username,
                                              email,
                                            });
                                          }}
                                          className="grid w-full text-start text-sm hover:bg-teal-600 hover:border-t-teal-600 hover:text-white px-4 py-1 duration-300 border-b"
                                        >
                                          <span>
                                            <em>name</em>&nbsp;
                                            {joinArrays(
                                              String(name),
                                              q,
                                              "bg-black rounded px-0.5 text-white"
                                            )}
                                          </span>
                                          <span>
                                            <em>username</em>&nbsp;
                                            {joinArrays(
                                              String(username),
                                              q,
                                              "bg-black rounded px-0.5 text-white"
                                            )}
                                          </span>
                                          <span>
                                            <em>email</em>&nbsp;
                                            {joinArrays(
                                              String(email),
                                              q,
                                              "bg-black rounded px-0.5 text-white"
                                            )}
                                          </span>
                                        </div>
                                      )}
                                    />
                                  </div>

                                  {filterFields.matchColumns.case.map(
                                    (f, index) => (
                                      <div
                                        key={index}
                                        className={`bg-white p-2 rounded shadow ${
                                          requestColumns.case.includes(f) &&
                                          "ring-1 ring-inset ring-teal-800"
                                        }`}
                                      >
                                        <h5 className="flex gap-2 items-center">
                                          <Checkbox
                                            checked={requestColumns.case.includes(
                                              f
                                            )}
                                            onChange={(_, checked) => {
                                              if (
                                                checked &&
                                                !requestColumns.case.includes(f)
                                              ) {
                                                setRequestColumns((p) => ({
                                                  ...p,
                                                  case: [...p.case, f],
                                                }));
                                              } else {
                                                setRequestColumns((p) => ({
                                                  ...p,
                                                  case: p.case.filter(
                                                    (k) => k !== f
                                                  ),
                                                }));
                                                delete requestPayload.case[f];
                                              }
                                            }}
                                            size="small"
                                            sx={MUI_STYLES.CheckBox}
                                          />
                                          <span>{snakeCaseToTitleCase(f)}</span>
                                        </h5>
                                        <div className="">
                                          <input
                                            // type={idx > 2 ? "number" : "text"}
                                            onChange={(e) => {
                                              setRequestPayload((p) => ({
                                                ...p,
                                                case: {
                                                  ...p.case,
                                                  [f]: e.target.value,
                                                },
                                              }));
                                            }}
                                            value={requestPayload.case[f] || ""}
                                            disabled={
                                              !requestColumns.case.includes(f)
                                            }
                                            required={requestColumns.case.includes(
                                              f
                                            )}
                                            placeholder="..."
                                            className="w-full bg-transparent outline-none border-b px-2 border-teal-800 disabled:border-gray-300 duration-300"
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ),
                            },
                            {
                              label: (
                                <h4 className={`relative`}>
                                  <span>Payment information</span>
                                  {!!requestColumns.payment_information
                                    .length && (
                                    <span className="absolute bottom-full bg-teal-800 text-xs text-white self-start h-4 w-4 rounded-full items-center justify-center">
                                      {
                                        requestColumns.payment_information
                                          .length
                                      }
                                    </span>
                                  )}
                                </h4>
                              ),
                              panel: (
                                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 vertical-scrollbar p-2 border rounded max-h-48 bg-gray-50/75 shadow">
                                  {filterFields.matchColumns.paymentInformation.map(
                                    (f, index) => (
                                      <div
                                        key={index}
                                        className={`bg-white p-2 rounded shadow ${
                                          requestColumns.payment_information.includes(
                                            f
                                          ) && "ring-1 ring-inset ring-teal-800"
                                        }`}
                                      >
                                        <h5 className="flex gap-2 items-center">
                                          <Checkbox
                                            checked={requestColumns.payment_information.includes(
                                              f
                                            )}
                                            onChange={(_, checked) => {
                                              if (
                                                checked &&
                                                !requestColumns.payment_information.includes(
                                                  f
                                                )
                                              ) {
                                                setRequestColumns((p) => ({
                                                  ...p,
                                                  payment_information: [
                                                    ...p.payment_information,
                                                    f,
                                                  ],
                                                }));
                                              } else {
                                                setRequestColumns((p) => ({
                                                  ...p,
                                                  payment_information:
                                                    p.payment_information.filter(
                                                      (k) => k !== f
                                                    ),
                                                }));
                                                delete requestPayload
                                                  .payment_information[f];
                                              }
                                            }}
                                            size="small"
                                            sx={MUI_STYLES.CheckBox}
                                          />
                                          <span>{snakeCaseToTitleCase(f)}</span>
                                        </h5>
                                        <div className="">
                                          <input
                                            // type={idx > 2 ? "number" : "text"}
                                            onChange={(e) => {
                                              setRequestPayload((p) => ({
                                                ...p,
                                                payment_information: {
                                                  ...p.payment_information,
                                                  [f]: e.target.value,
                                                },
                                              }));
                                            }}
                                            value={
                                              requestPayload
                                                .payment_information[f] || ""
                                            }
                                            disabled={
                                              !requestColumns.payment_information.includes(
                                                f
                                              )
                                            }
                                            required={requestColumns.payment_information.includes(
                                              f
                                            )}
                                            placeholder="..."
                                            className="w-full bg-transparent outline-none border-b px-2 border-teal-800 disabled:border-gray-300 duration-300"
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ),
                            },
                          ]
                        : [
                            {
                              label: (
                                <h4 className={`relative`}>
                                  <span>Cases</span>
                                  {!!requestColumns.case.length && (
                                    <span className="absolute bottom-full bg-teal-800 text-xs text-white self-start h-4 w-4 rounded-full items-center justify-center">
                                      {requestColumns.case.length}
                                    </span>
                                  )}
                                </h4>
                              ),
                              panel: (
                                <div className="grid gap-2 md:grid-cols-2 vertical-scrollbar p-2 border rounded max-h-48 bg-gray-50/75 shadow">
                                  {filterFields.rangeableColumns.case.map(
                                    (f, index) => (
                                      <div
                                        key={index}
                                        className={`bg-white p-2 rounded shadow ${
                                          requestColumns.case.includes(f) &&
                                          "ring-1 ring-inset ring-teal-800"
                                        }`}
                                      >
                                        <h5 className="flex gap-2 items-center">
                                          <Checkbox
                                            checked={requestColumns.case.includes(
                                              f
                                            )}
                                            onChange={(_, checked) => {
                                              if (
                                                checked &&
                                                !requestColumns.case.includes(f)
                                              ) {
                                                setRequestColumns((p) => ({
                                                  ...p,
                                                  case: [...p.case, f],
                                                }));
                                              } else {
                                                setRequestColumns((p) => ({
                                                  ...p,
                                                  case: p.case.filter(
                                                    (k) => k !== f
                                                  ),
                                                }));
                                                delete rangePayload.case[f];
                                              }
                                            }}
                                            size="small"
                                            sx={MUI_STYLES.CheckBox}
                                          />
                                          <span>{snakeCaseToTitleCase(f)}</span>
                                        </h5>
                                        <div className="grid grid-cols-5">
                                          <input
                                            type={
                                              f === "created_at" ||
                                              f === "updated_at"
                                                ? "datetime-local"
                                                : "number"
                                            }
                                            onChange={(e) => {
                                              if (rangePayload.case[f]) {
                                                const second =
                                                  rangePayload.case[f][1];

                                                setRangePayload((p) => ({
                                                  ...p,
                                                  case: {
                                                    ...p.case,
                                                    [f]: [
                                                      e.target.value,
                                                      second,
                                                    ],
                                                  },
                                                }));
                                              } else {
                                                setRangePayload((p) => ({
                                                  ...p,
                                                  case: {
                                                    ...p.case,
                                                    [f]: [e.target.value, ""],
                                                  },
                                                }));
                                              }
                                            }}
                                            value={
                                              rangePayload.case[f]
                                                ? rangePayload.case[f][0] || ""
                                                : ""
                                            }
                                            disabled={
                                              !requestColumns.case.includes(f)
                                            }
                                            required={requestColumns.case.includes(
                                              f
                                            )}
                                            placeholder="From"
                                            className="w-full col-span-2 disabled:cursor-not-allowed bg-transparent outline-none border px-2 border-teal-800 disabled:border-gray-300 duration-300"
                                          />
                                          <div className="flex px-2 self-center items-center gap-2">
                                            <span>&gt;=</span>
                                            <span className="flex-grow border-b-4 border-dotted border-teal-800"></span>
                                            <span>&lt;</span>
                                          </div>
                                          <input
                                            type={
                                              f === "created_at" ||
                                              f === "updated_at"
                                                ? "datetime-local"
                                                : "number"
                                            }
                                            onChange={(e) => {
                                              if (rangePayload.case[f]) {
                                                const first =
                                                  rangePayload.case[f][0];

                                                setRangePayload((p) => ({
                                                  ...p,
                                                  case: {
                                                    ...p.case,
                                                    [f]: [
                                                      first,
                                                      e.target.value,
                                                    ],
                                                  },
                                                }));
                                              } else {
                                                setRangePayload((p) => ({
                                                  ...p,
                                                  case: {
                                                    ...p.case,
                                                    [f]: ["", e.target.value],
                                                  },
                                                }));
                                              }
                                            }}
                                            value={
                                              rangePayload.case[f]
                                                ? rangePayload.case[f][1] || ""
                                                : ""
                                            }
                                            disabled={
                                              !requestColumns.case.includes(f)
                                            }
                                            required={requestColumns.case.includes(
                                              f
                                            )}
                                            placeholder="To"
                                            className="w-full col-span-2 disabled:cursor-not-allowed bg-transparent outline-none border px-2 border-teal-800 disabled:border-gray-300 duration-300"
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ),
                            },
                            {
                              label: (
                                <h4 className={`relative`}>
                                  <span>Payment information</span>
                                  {!!requestColumns.payment_information
                                    .length && (
                                    <span className="absolute bottom-full bg-teal-800 text-xs text-white self-start h-4 w-4 rounded-full items-center justify-center">
                                      {
                                        requestColumns.payment_information
                                          .length
                                      }
                                    </span>
                                  )}
                                </h4>
                              ),
                              panel: (
                                <div className="grid gap-2 md:grid-cols-2 vertical-scrollbar p-2 border rounded max-h-48 bg-gray-50/75 shadow">
                                  {filterFields.rangeableColumns.paymentInformation.map(
                                    (f, index) => (
                                      <div
                                        key={index}
                                        className={`bg-white p-2 rounded shadow ${
                                          requestColumns.payment_information.includes(
                                            f
                                          ) && "ring-1 ring-inset ring-teal-800"
                                        }`}
                                      >
                                        <h5 className="flex gap-2 items-center">
                                          <Checkbox
                                            checked={requestColumns.payment_information.includes(
                                              f
                                            )}
                                            onChange={(_, checked) => {
                                              if (
                                                checked &&
                                                !requestColumns.payment_information.includes(
                                                  f
                                                )
                                              ) {
                                                setRequestColumns((p) => ({
                                                  ...p,
                                                  payment_information: [
                                                    ...p.payment_information,
                                                    f,
                                                  ],
                                                }));
                                              } else {
                                                setRequestColumns((p) => ({
                                                  ...p,
                                                  payment_information:
                                                    p.payment_information.filter(
                                                      (k) => k !== f
                                                    ),
                                                }));
                                                delete requestPayload
                                                  .payment_information[f];
                                              }
                                            }}
                                            size="small"
                                            sx={MUI_STYLES.CheckBox}
                                          />
                                          <span>{snakeCaseToTitleCase(f)}</span>
                                        </h5>
                                        <div className="grid grid-cols-5">
                                          <input
                                            type={
                                              f === "created_at" ||
                                              f === "updated_at"
                                                ? "datetime-local"
                                                : "number"
                                            }
                                            onChange={(e) => {
                                              if (
                                                rangePayload
                                                  .payment_information[f]
                                              ) {
                                                const second =
                                                  rangePayload
                                                    .payment_information[f][1];

                                                setRangePayload((p) => ({
                                                  ...p,
                                                  payment_information: {
                                                    ...p.payment_information,
                                                    [f]: [
                                                      e.target.value,
                                                      second,
                                                    ],
                                                  },
                                                }));
                                              } else {
                                                setRangePayload((p) => ({
                                                  ...p,
                                                  payment_information: {
                                                    ...p.payment_information,
                                                    [f]: [e.target.value, ""],
                                                  },
                                                }));
                                              }
                                            }}
                                            value={
                                              rangePayload.payment_information[
                                                f
                                              ]
                                                ? rangePayload
                                                    .payment_information[
                                                    f
                                                  ][0] || ""
                                                : ""
                                            }
                                            disabled={
                                              !requestColumns.payment_information.includes(
                                                f
                                              )
                                            }
                                            required={requestColumns.payment_information.includes(
                                              f
                                            )}
                                            placeholder="From"
                                            className="w-full col-span-2 disabled:cursor-not-allowed bg-transparent outline-none border px-2 border-teal-800 disabled:border-gray-300 duration-300"
                                          />
                                          <div className="flex px-2 self-center items-center gap-2">
                                            <span>&gt;=</span>
                                            <span className="flex-grow border-b-4 border-dotted border-teal-800"></span>
                                            <span>&lt;</span>
                                          </div>
                                          <input
                                            type={
                                              f === "created_at" ||
                                              f === "updated_at"
                                                ? "datetime-local"
                                                : "number"
                                            }
                                            onChange={(e) => {
                                              if (
                                                rangePayload
                                                  .payment_information[f]
                                              ) {
                                                const first =
                                                  rangePayload
                                                    .payment_information[f][0];

                                                setRangePayload((p) => ({
                                                  ...p,
                                                  payment_information: {
                                                    ...p.payment_information,
                                                    [f]: [
                                                      first,
                                                      e.target.value,
                                                    ],
                                                  },
                                                }));
                                              } else {
                                                setRangePayload((p) => ({
                                                  ...p,
                                                  payment_information: {
                                                    ...p.payment_information,
                                                    [f]: ["", e.target.value],
                                                  },
                                                }));
                                              }
                                            }}
                                            value={
                                              rangePayload.payment_information[
                                                f
                                              ]
                                                ? rangePayload
                                                    .payment_information[
                                                    f
                                                  ][1] || ""
                                                : ""
                                            }
                                            disabled={
                                              !requestColumns.payment_information.includes(
                                                f
                                              )
                                            }
                                            required={requestColumns.payment_information.includes(
                                              f
                                            )}
                                            placeholder="To"
                                            className="w-full col-span-2 disabled:cursor-not-allowed bg-transparent outline-none border px-2 border-teal-800 disabled:border-gray-300 duration-300"
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ),
                            },
                          ]),
                    ]}
                  />
                </div>

                <div>
                  <h3>Click to select fields to include in the response:</h3>
                  <KTabs
                    items={[
                      {
                        label: (
                          <h4 className={`relative`}>
                            <span>Desired case fields</span>
                            {!!responseColumns.case.length && (
                              <span className="absolute bottom-full bg-teal-800 text-xs text-white self-start h-4 w-4 rounded-full items-center justify-center">
                                {responseColumns.case.length}
                              </span>
                            )}
                          </h4>
                        ),
                        panel: (
                          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 vertical-scrollbar p-2 border rounded max-h-48 bg-gray-50/75 shadow">
                            {filterFields.responseColumns.case.map(
                              (f, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center gap-2 bg-white rounded shadow ${
                                    responseColumns.case.includes(f) &&
                                    "ring-1 ring-inset ring-teal-800"
                                  }`}
                                >
                                  <Checkbox
                                    checked={responseColumns.case.includes(f)}
                                    onChange={(_, checked) => {
                                      if (
                                        checked &&
                                        !responseColumns.case.includes(f)
                                      ) {
                                        setResponseColumns((p) => ({
                                          ...p,
                                          case: [...p.case, f],
                                        }));
                                      } else {
                                        setResponseColumns((p) => ({
                                          ...p,
                                          case: p.case.filter((k) => k !== f),
                                        }));
                                      }
                                    }}
                                    size="small"
                                    sx={MUI_STYLES.CheckBox}
                                  />
                                  <span>{snakeCaseToTitleCase(f)}</span>
                                </div>
                              )
                            )}
                          </div>
                        ),
                      },
                      {
                        label: (
                          <h4 className={`relative`}>
                            <span>Desired payment information fields</span>
                            {!!responseColumns.payment_information.length && (
                              <span className="absolute bottom-full bg-teal-800 text-xs text-white self-start h-4 w-4 rounded-full items-center justify-center">
                                {responseColumns.payment_information.length}
                              </span>
                            )}
                          </h4>
                        ),
                        panel: (
                          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 vertical-scrollbar p-2 border rounded max-h-48 bg-gray-50/75 shadow">
                            {filterFields.responseColumns.paymentInformation.map(
                              (f, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center gap-2 bg-white rounded shadow ${
                                    responseColumns.payment_information.includes(
                                      f
                                    ) && "ring-1 ring-inset ring-teal-800"
                                  }`}
                                >
                                  <Checkbox
                                    checked={responseColumns.payment_information.includes(
                                      f
                                    )}
                                    onChange={(_, checked) => {
                                      if (
                                        checked &&
                                        !responseColumns.payment_information.includes(
                                          f
                                        )
                                      ) {
                                        setResponseColumns((p) => ({
                                          ...p,
                                          payment_information: [
                                            ...p.payment_information,
                                            f,
                                          ],
                                        }));
                                      } else {
                                        setResponseColumns((p) => ({
                                          ...p,
                                          payment_information:
                                            p.payment_information.filter(
                                              (k) => k !== f
                                            ),
                                        }));
                                      }
                                    }}
                                    size="small"
                                    sx={MUI_STYLES.CheckBox}
                                  />
                                  <span>{snakeCaseToTitleCase(f)}</span>
                                </div>
                              )
                            )}
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>

                <div className="shadow rounded overflow-hidden border">
                  <Alert
                    square
                    sx={{ paddingY: 0 }}
                    severity={`${
                      requestColumns.case.length > 0 ||
                      requestColumns.payment_information.length > 0
                        ? "success"
                        : "info"
                    }`}
                  >
                    Atleast one request attribute checked!
                  </Alert>
                  <Alert
                    square
                    sx={{ paddingY: 0 }}
                    severity={`${
                      responseColumns.case.length > 0 ||
                      responseColumns.payment_information.length > 0
                        ? "success"
                        : "info"
                    }`}
                  >
                    {filterType === "single"
                      ? "Atleast one response columns selected!"
                      : "You will always get all the case attributes in the result set if you do not specify response columns."}
                  </Alert>
                  {filterType === "single" ? (
                    <Alert
                      square
                      sx={{ paddingY: 0 }}
                      severity={`${
                        !emptyRequestPayloadFields() ? "success" : "info"
                      }`}
                    >
                      No empty fields
                    </Alert>
                  ) : (
                    <Alert className="">
                      {`Empty fields for the minimum values when using ranges are
                      coerced to zero for number fields and ${new Date(
                        1
                      ).toDateString()} ${new Date(1).toTimeString()}
                      for date or time fields`}
                    </Alert>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <LoadingButton
                    onClick={() => handleSubmit("data")}
                    disabled={!canApply()}
                    loading={filtering}
                    sx={{
                      ...MUI_STYLES.Button2,
                    }}
                    type="submit"
                    variant="contained"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircleIcon height={20} />
                      <span>Apply Filters</span>
                    </span>
                  </LoadingButton>

                  {results.length > 0 && (
                    <>
                      <div className="flex rounded-lg overflow-hidden">
                        {exportFormats.map((format, index) => (
                          <button
                            onClick={() => {
                              setExportFormat(format);
                            }}
                            className={`flex items-center gap-2 px-4 duration-300 ${
                              exportFormat.ext === format.ext
                                ? "bg-teal-800 text-white hover:bg-teal-600"
                                : "bg-gray-300"
                            }`}
                            key={index}
                          >
                            {format.icon}
                            {format.name}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleExport()}
                        className="bg-teal-900 px-4 w-36 py-2 text-white hover:bg-teal-700 duration-300 rounded-lg"
                      >
                        Export {exportFormat.name}
                      </button>
                    </>
                  )}

                  {results.length > 0 && dataUrl && (
                    <a
                      href={dataUrl}
                      download={`FILTER_RESULTS_${new Date()
                        .toDateString()
                        .replace(/\s+/g, "_")}${exportFormat.ext}`}
                      className="flex bg-teal-900 px-4 py-2 text-white hover:bg-teal-700 duration-300 rounded-lg"
                    >
                      <Download />
                      <span>Download</span>
                      <span className="uppercase">{exportFormat.name}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white border shadow rounded p-2 grid">
              <h3 className="px-2 font-bold">Results</h3>
              <div className="horizontal-scrollbar pb-2">
                {results.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr>
                        {allResponseColumns().map((column, index) => (
                          <th
                            key={`th#${index}`}
                            className={`text-start px-2 text-teal-800 py-1 truncate max-w-64 ${
                              index > 0 && "border-l"
                            }`}
                          >
                            {snakeCaseToTitleCase(column)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results?.map((record, index) => (
                        <tr key={index} className="border-t">
                          {allResponseColumns().map((column, index) => (
                            <td
                              key={`td#${index}`}
                              className={`px-2 py-1 truncate max-w-64 ${
                                index > 0 && "border-l"
                              }`}
                            >
                              {record[column]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-2">No results...</div>
                )}
              </div>

              {!!count?.count && (
                <div className="p-2 flex items-center gap-4">
                  <InputSelection
                    value={itemsPerPage}
                    onChange={(newValue) =>
                      setNumberOfItemsPerPage(Number(newValue))
                    }
                    label="Results per page"
                    name="results_per_page"
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
                      disabled={!canApply()}
                      page={currentPage}
                      onChange={(_, page) => {
                        setNextPage(page);
                      }}
                      size="small"
                      count={Math.ceil(count.count / Number(itemsPerPage))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
