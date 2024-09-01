import { useEffect, useState } from "react";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import {
  Alert,
  Checkbox,
  Drawer,
  IconButton,
  Pagination,
  Radio,
  setRef,
} from "@mui/material";
import { Close, Download } from "@mui/icons-material";
import {
  array2d,
  csvString,
  insertQueryParams,
  snakeCaseToTitleCase,
} from "../../lib/utils";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../hooks/useAPI";
import { axiosGet, axiosPost } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import {
  CheckCircleIcon,
  Cog8ToothIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { ReactState } from "../../ui/definitions";
import { filterFields } from "../../lib/data";
import usePagination from "../../hooks/usePagination";
import KTabs from "../../ui/Tabs";
import * as XLSX from "xlsx";
import InputSelection, { InputOption } from "../../ui/InputSelection";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import { TanstackSuspense } from "../../ui/TanstackSuspense";
import { PartialClient, Population } from "../../lib/definitions";
import { InputField } from "../../ui/modals/EditModal";

export type FilterCriteria = "match" | "strict";

const exportFormats = [
  { name: "excel", icon: <FaceSmileIcon height={24} />, ext: ".xlsx" },
  {
    name: "csv",
    icon: <FaceSmileIcon height={24} />,
    ext: ".csv",
  },
];

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
  const handleRequest = useAPI();
  const { currentPage, setNextPage, setNumberOfItemsPerPage, itemsPerPage } =
    usePagination();
  const [dataUrl, setDataUrl] = useState("");
  const [exportFormat, setExportFormat] = useState({
    name: "excel",
    icon: <FaceSmileIcon height={24} />,
    ext: ".xlsx",
  });
  const [count, setCount] = useState<Population>({ count: 0 });

  const allResponseColumns = () => [
    ...responseColumns.case,
    ...responseColumns.payment_information,
  ];

  const handleExport = () => {
    if (exportFormat.name === "csv") {
      setDataUrl(handleCsv(results, allResponseColumns()));
    } else {
      setDataUrl(handleExcel(results, allResponseColumns()));
    }
  };

  function handleSubmit(response: "count" | "data") {
    setFiltering(true);
    // const payload: Record<"match_columns" | "response_columns", Record<"case" | "payment_information", > > = {}
    const payload = {
      match_columns: {
        ...(Object.entries(requestPayload.case).length > 0
          ? { case: requestPayload.case }
          : {}),
        ...(Object.entries(requestPayload.payment_information).length > 0
          ? { payment_information: requestPayload.payment_information }
          : {}),
      },
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
        insertQueryParams(APIS.filter.casesFilter, {
          criteria,
          page_number: currentPage,
          page_population: itemsPerPage,
          response,
        }),
        payload,
      ],
    })
      .then((res) => {
        if (res.status === "ok" && res.result) {
          if (response === "data" && Array.isArray(res.result)) {
            console.log(res.result);
            setResults(res.result);
          } else {
            setCount(res.result as Population);
          }
        }
      })
      .finally(() => setFiltering(false));
  }

  useEffect(() => {
    handleSubmit("data");
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (results.length) {
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
          className: "p-2",
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
                <div className="bg-gray-50 p-2 rounded shadow">
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
                  <h3>Choose fields to filter against:</h3>
                  <KTabs
                    items={[
                      {
                        label: <h4>Case</h4>,
                        panel: (
                          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 vertical-scrollbar p-2 border rounded max-h-48 bg-gray-50/75 shadow">
                            <TanstackSuspense
                              fallback={
                                <div className="flex items-center gap-2 bg-white shadow p-4 rounded">
                                  <span className=" animate-spin">
                                    <Cog8ToothIcon height={20} />
                                  </span>
                                  <div>Fetching clients...</div>
                                </div>
                              }
                              queryKey={[TANSTACK_QUERY_KEYS.ALL_CLIENTS]}
                              queryFn={() =>
                                handleRequest<PartialClient[]>({
                                  func: axiosGet,
                                  args: [APIS.clients.getAllClients],
                                })
                              }
                              RenderData={({ data }) => {
                                if (data.status === "ok" && data.result) {
                                  const clients = data.result;

                                  const clientInputOptions: InputOption[] =
                                    clients.map(({ id, name }) => ({
                                      name,
                                      level: 0,
                                      type: "item",
                                      value: id,
                                    }));

                                  return (
                                    <>
                                      {clients.length > 0 ? (
                                        <div className="bg-white p-2 rounded shadow flex items-center">
                                          <h5 className="flex gap-2 items-center">
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
                                                    case: [
                                                      ...p.case,
                                                      "client_id",
                                                    ],
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
                                                }
                                              }}
                                              size="small"
                                              sx={MUI_STYLES.CheckBox}
                                            />
                                            {/* <span>Client</span> */}
                                          </h5>
                                          <InputField
                                            enabled={requestColumns.case.includes(
                                              "client_id"
                                            )}
                                            name="client_id"
                                            label="Select Client"
                                            onChange={(newValue) => {
                                              setRequestPayload((p) => ({
                                                ...p,
                                                case: {
                                                  ...p.case,
                                                  client_id: newValue,
                                                },
                                              }));
                                            }}
                                            value={
                                              requestPayload.case[
                                                "client_id"
                                              ] || ""
                                            }
                                            options={{
                                              type: "select",
                                              options: [
                                                {
                                                  name: "None",
                                                  level: 0,
                                                  type: "item",
                                                  value: "",
                                                },
                                                ...clientInputOptions,
                                              ],
                                            }}
                                            required={true}
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-between gap-2 bg-teal-50 shadow p-4 rounded">
                                          No clients found...
                                        </div>
                                      )}
                                    </>
                                  );
                                }
                                return (
                                  <div>
                                    <Alert severity="error">
                                      Sorry, an error occured while fetching
                                      clients
                                    </Alert>
                                  </div>
                                );
                              }}
                            />
                            {filterFields.matchColumns.case.map((f, index) => (
                              <div
                                key={index}
                                className="bg-white p-2 rounded shadow"
                              >
                                <h5 className="flex gap-2 items-center">
                                  <Checkbox
                                    checked={requestColumns.case.includes(f)}
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
                                          case: p.case.filter((k) => k !== f),
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
                                    disabled={!requestColumns.case.includes(f)}
                                    required={requestColumns.case.includes(f)}
                                    placeholder="..."
                                    className="w-full bg-transparent outline-none border-b px-2 border-teal-800 disabled:border-gray-300 duration-300"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ),
                      },
                      {
                        label: <h4>Payment information</h4>,
                        panel: (
                          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 vertical-scrollbar p-2 border rounded max-h-48 bg-gray-50/75 shadow">
                            {filterFields.matchColumns.paymentInformation.map(
                              (f, index) => (
                                <div
                                  key={index}
                                  className="bg-white p-2 rounded shadow"
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
                                        requestPayload.payment_information[f] ||
                                        ""
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
                    ]}
                  />
                </div>

                <div>
                  <h3>Click to select fields to include in the response:</h3>
                  <KTabs
                    items={[
                      {
                        label: <h3>Desired case fields</h3>,
                        panel: (
                          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 vertical-scrollbar p-2 border rounded max-h-48 bg-gray-50/75 shadow">
                            {filterFields.responseColumns.case.map(
                              (f, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 bg-white rounded shadow"
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
                        label: <h3>Desired payment information fields</h3>,
                        panel: (
                          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 vertical-scrollbar p-2 border rounded max-h-48 bg-gray-50/75 shadow">
                            {filterFields.responseColumns.paymentInformation.map(
                              (f, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 bg-white rounded shadow"
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
                    Atleast one response columns selected!
                  </Alert>
                  <Alert
                    square
                    sx={{ paddingY: 0 }}
                    severity={`${
                      requestColumns.case.some(
                        (col) => !!requestPayload.case[col]
                      ) ||
                      requestColumns.payment_information.some(
                        (col) => !!requestPayload.payment_information[col]
                      )
                        ? "success"
                        : "info"
                    }`}
                  >
                    No empty fields
                  </Alert>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <LoadingButton
                    onClick={() => handleSubmit("data")}
                    disabled={
                      (requestColumns.case.length < 1 &&
                        requestColumns.payment_information.length < 1) ||
                      (responseColumns.case.length < 1 &&
                        responseColumns.payment_information.length < 1) ||
                      requestColumns.case.some(
                        (col) => !!!requestPayload.case[col]
                      ) ||
                      requestColumns.payment_information.some(
                        (col) => !!!requestPayload.payment_information[col]
                      )
                    }
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
                                : "bg-gray-300 text-gray-300"
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
                            className="text-start px-2 text-teal-800 py-1 truncate"
                          >
                            {snakeCaseToTitleCase(column)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results?.map((record, index) => (
                        <tr key={index} className="border-t">
                          {[
                            ...responseColumns.case,
                            ...responseColumns.payment_information,
                          ].map((column, index) => (
                            <td
                              key={`td#${index}`}
                              className="px-2 py-1 truncate"
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
