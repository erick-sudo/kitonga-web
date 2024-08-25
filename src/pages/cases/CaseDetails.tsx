import { useParams } from "react-router-dom";
import {
  Case,
  Client,
  InitializePaymentInformationDto,
  PaymentInformation,
} from "../../lib/definitions";
import { TanstackSuspense } from "../../ui/TanstackSuspense";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import useAPI from "../../hooks/useAPI";
import { axiosGet, axiosPost } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { Alert } from "@mui/material";
import {
  CaseDetailsSkeleton,
  ClientDetailsSkeleton,
  PaymentListSkeleton,
} from "../../ui/Skeletons";
import { InitializePaymentInformation } from "./InitializePaymentInformation";
import {
  PencilSquareIcon,
  TrashIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { DoorbellSharp, MonetizationOn, Summarize } from "@mui/icons-material";
import { Progress } from "../../ui/Progress";
import { KitongaColorScheme } from "../../lib/MUI_STYLES";
import { Masonry } from "@mui/lab";
import { ManualModal } from "../../ui/modals/ManualModal";
import { formatCurrency } from "../../lib/utils";

export function CaseDetails() {
  const handleRequest = useAPI();
  const { caseId } = useParams();
  const queryKey = `${TANSTACK_QUERY_KEYS.CASE_DETAILS}#${caseId}`;
  //   const addInstallment = (payload) => {
  //     setLoading(true);
  //     apiCalls.postRequest({
  //       endpoint: endpoints.cases.addInstallment.replace("<:caseId>", casey.id),
  //       httpHeaders: {
  //         Accept: "application/json",
  //         Authorization: "Bearer " + sessionStorage.getItem("token"),
  //         "Content-Type": "application/json",
  //       },
  //       httpBody: payload,
  //       successCallback: (res) => {
  //         setLoading(false);
  //         notifiers.httpSuccess("New Installment Recorded");
  //         setPaymentInformation(res);
  //       },
  //       errorCallback: (err) => {
  //         setLoading(false);
  //         notifiers.httpError(err);
  //       },
  //     });
  //   };

  //   const addParty = (payload) => {
  //     setLoading(true);
  //     apiCalls.postRequest({
  //       endpoint: endpoints.cases.addParty.replace("<:caseId>", casey.id),
  //       httpHeaders: {
  //         Accept: "application/json",
  //         Authorization: "Bearer " + sessionStorage.getItem("token"),
  //         "Content-Type": "application/json",
  //       },
  //       httpBody: payload,
  //       successCallback: (res) => {
  //         setLoading(false);
  //         notifiers.httpSuccess("Added New Party");
  //         setParties(res);
  //       },
  //       errorCallback: (err) => {
  //         setLoading(false);
  //         notifiers.httpError(err);
  //       },
  //     });
  //   };

  //   function submitPaymentInformation(payload) {
  //     setLoading(true);
  //     apiCalls.postRequest({
  //       endpoint: endpoints.cases.initializePaymentInformation.replace(
  //         "<:caseId>",
  //         casey.id
  //       ),
  //       httpHeaders: {
  //         Accept: "application/json",
  //         Authorization: "Bearer " + sessionStorage.getItem("token"),
  //         "Content-Type": "application/json",
  //       },
  //       httpBody: payload,
  //       successCallback: (res) => {
  //         setLoading(false);
  //         notifiers.httpSuccess("Succesfully Initialized Payment");
  //         setPaymentInformation(res);
  //       },
  //       errorCallback: (err) => {
  //         setLoading(false);
  //         notifiers.httpError(err);
  //       },
  //     });
  //   }

  //   const handleCumulativePaymentChange = (payload) => {
  //     setPaymentInformation(payload);
  //   };

  return (
    <div className="px-4 pb-4">
      <div className="flex flex-col gap-8">
        <div>
          <div>
            <TanstackSuspense
              fallback={<CaseDetailsSkeleton />}
              queryKey={[queryKey]}
              queryFn={() =>
                handleRequest<Case>({
                  func: axiosGet,
                  args: [APIS.cases.getCase.replace("<:caseId>", `${caseId}`)],
                })
              }
              RenderData={({ data }) => {
                if (data.status === "ok" && data.result) {
                  const {
                    title,
                    description,
                    case_no_or_parties,
                    client_id,
                    clients_reference,
                    file_reference,
                    record,
                  } = data.result;

                  return (
                    <div className="grid gap-2">
                      <div className="bg-white p-4 shadow rounded">
                        <div className="flex items-start border-b py-1">
                          <h4 className="min-w-44 max-w-44">Title</h4>
                          <p className="flex-grow">{title}</p>
                        </div>
                        <div className="flex items-start border-b py-1">
                          <h4 className="min-w-44 max-w-44">Description</h4>
                          <p className="flex-grow">{description}</p>
                        </div>
                        <div className="flex items-start border-b py-1">
                          <h4 className="min-w-44 max-w-44">
                            Case NO. or Parties
                          </h4>
                          <p className="flex-grow">{case_no_or_parties}</p>
                        </div>
                        <div className="flex items-start border-b py-1">
                          <h4 className="min-w-44 max-w-44">File Reference</h4>
                          <p className="flex-grow">{file_reference}</p>
                        </div>
                        <div className="flex items-start border-b py-1">
                          <h4 className="min-w-44 max-w-44">
                            Clients Reference
                          </h4>
                          <p className="flex-grow">{clients_reference}</p>
                        </div>
                        <div className="flex items-start py-1">
                          <h4 className="min-w-44 max-w-44">Record</h4>
                          <p className="flex-grow">{record}</p>
                        </div>
                      </div>

                      {/* Client */}
                      <ClientDetails client_id={client_id} />

                      {/* Payment Information */}
                      <PaymentInformationDetails caseId={`${caseId}`} />
                    </div>
                  );
                }

                return (
                  <div className="shadow rounded mt-2">
                    <Alert severity="error">
                      <span className="block">{data.errors?.status}</span>
                      <span className="block">{data.errors?.error}</span>
                    </Alert>
                  </div>
                );
              }}
              defaultErrorClassName="p-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentInformationDetails({ caseId }: { caseId: string }) {
  const handleRequest = useAPI();
  const clientKey = `${TANSTACK_QUERY_KEYS.PAYMENT_INFORMATION_DETAILS}#${caseId}`;

  async function submitInitialPaymentInformation(
    payload: InitializePaymentInformationDto
  ) {
    return await handleRequest<PaymentInformation>({
      func: axiosPost,
      args: [
        APIS.cases.initializePaymentInformation.replace("<:caseId>", caseId),
        payload,
      ],
    });
  }

  return (
    <TanstackSuspense
      fallback={<PaymentListSkeleton />}
      queryKey={[clientKey]}
      queryFn={() =>
        handleRequest<PaymentInformation | null>({
          func: axiosGet,
          args: [APIS.cases.getPaymentInformation.replace("<:caseId>", caseId)],
        })
      }
      RenderData={({ data }) => {
        // console.log(data);

        if (data.status === "ok") {
          if (data.result) {
            const {
              paid_amount,
              payment_type,
              outstanding,
              total_fee,
              cummulative_payments,
            } = data.result;

            return (
              <div>
                <div className="overflow-hidden rounded">
                  <h4 className="text-teal-900 font-semibold">
                    Payment Information
                  </h4>

                  {/* <EditModal
                      receiveNewRecord={(res) => {
                        setPaymentInformation(res);
                      }}
                      description="Edit Payment Information"
                      anchorText="Edit Payment Information"
                      dataEndpoint={endpoints.cases.getPaymentInformation.replace(
                        "<:caseId>",
                        casex.id
                      )}
                      updateEndpoint={endpoints.cases.patchPaymentInformation.replace(
                        "<:caseId>",
                        casex.id
                      )}
                      editableFields={[
                        {
                          name: "payment_type",
                          as: "select",
                          required: true,
                          label: "Select Type of Payment",
                          options: [
                            {
                              value: "full",
                              label: "Full Payment",
                            },
                            {
                              value: "installment",
                              label: "Installment",
                            },
                          ],
                        },
                        {
                          name: "outstanding",
                          as: "text",
                          required: true,
                        },
                        {
                          name: "paid_amount",
                          as: "text",
                          required: true,
                        },
                        {
                          name: "total_fee",
                          as: "text",
                          required: true,
                        },
                        {
                          name: "deposit_pay",
                          as: "text",
                          required: true,
                        },
                        {
                          name: "deposit_fees",
                          as: "text",
                          required: true,
                        },
                        {
                          name: "final_fees",
                          as: "text",
                          required: true,
                        },
                        {
                          name: "final_pay",
                          as: "text",
                          required: true,
                        },
                        {
                          name: "deposit",
                          as: "text",
                          required: true,
                        },
                      ]}
                    /> */}
                  <Masonry columns={{ xs: 1, sm: 3, md: 3 }}>
                    <div className="rounded shadow bg-white line-shadow p-4">
                      <div className="text-center pb-2">Payment Completion</div>
                      <div className="px-4 max-w-[7.5rem] p-2 mx-auto">
                        <Progress
                          width={10}
                          completeColor={KitongaColorScheme.teal900}
                          incompleteColor={"rgb(19 78 74 / 0.1)"}
                          innerClassName="bg-teal-100 font-extrabold text-teal-900"
                          percentage={
                            (Number(paid_amount) / Number(total_fee)) * 100
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center relative rounded bg-white shadow px-2 py-4">
                      <div className="text-2xl text-teal-800 h-12 w-12 flex items-center justify-center">
                        <Summarize />
                      </div>
                      <div className="flex flex-col">
                        <span>Total Fee</span>
                        <span className="text-teal-800 font-bold px-2">
                          {formatCurrency(Number(total_fee))}
                        </span>
                        <div className="absolute shadow-md shadow-gray-700/10 hover:shadow-xl hover:shadow-gray-800/50 hover:scale-105 duration-300 rounded-lg px-2 py-1 right-2">
                          {/* <EditModal
                                description="Change Total Fee"
                                dataEndpoint={endpoints.cases.getPaymentInformation.replace(
                                  "<:caseId>",
                                  casey.id
                                )}
                                updateEndpoint={endpoints.cases.patchPaymentInformation.replace(
                                  "<:caseId>",
                                  casey.id
                                )}
                                editableFields={[
                                  { name: "total_fee", as: "number" },
                                ]}
                                anchorClassName="text-amber-800"
                                anchorText="......."
                                icon={<FontAwesomeIcon icon={faPencil} />}
                                receiveNewRecord={(res) => {
                                  setPaymentInformation(res);
                                }}
                              /> */}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center relative rounded shadow bg-white px-2 py-4">
                      <div className="text-2xl text-teal-800 h-12 w-12 flex items-center justify-center">
                        <WalletIcon height={20} />
                      </div>
                      <div className="flex flex-col">
                        <span>Payment Type</span>
                        <span className="text-teal-800 font-bold uppercase">
                          {payment_type}
                        </span>
                        <div className="absolute shadow-md shadow-gray-700/10 hover:shadow-xl hover:shadow-gray-800/50 hover:scale-105 duration-300 rounded-lg px-2 py-1 right-2">
                          {/* <EditModal
                                description="Change type of payment"
                                dataEndpoint={endpoints.cases.getPaymentInformation.replace(
                                  "<:caseId>",
                                  casey.id
                                )}
                                updateEndpoint={endpoints.cases.patchPaymentInformation.replace(
                                  "<:caseId>",
                                  casey.id
                                )}
                                editableFields={[
                                  {
                                    name: "payment_type",
                                    as: "select",
                                    label: "Select Payment Type",
                                    options: [
                                      { label: "Full", value: "full" },
                                      {
                                        label: "Installment",
                                        value: "installment",
                                      },
                                    ],
                                  },
                                ]}
                                anchorClassName="text-amber-800"
                                anchorText="......."
                                icon={<FontAwesomeIcon icon={faPencil} />}
                                receiveNewRecord={(res) => {
                                  setPaymentInformation(res);
                                }}
                              /> */}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center relative rounded bg-white shadow px-2 py-4">
                      <div className="text-2xl text-teal-800 h-12 w-12 flex items-center justify-center">
                        <MonetizationOn />
                      </div>
                      <div className="flex flex-col">
                        <span>Outstanding</span>
                        <span className="text-teal-800 font-bold">
                          {formatCurrency(Number(outstanding))}
                        </span>
                        <div className="absolute shadow-md shadow-gray-700/10 hover:shadow-xl hover:shadow-gray-800/50 hover:scale-105 duration-300 rounded-lg px-2 py-1 right-2">
                          {/* <EditModal
                                description="Change Due Balance"
                                dataEndpoint={endpoints.cases.getPaymentInformation.replace(
                                  "<:caseId>",
                                  casey.id
                                )}
                                updateEndpoint={endpoints.cases.patchPaymentInformation.replace(
                                  "<:caseId>",
                                  casey.id
                                )}
                                editableFields={[
                                  { name: "outstanding", as: "number" },
                                ]}
                                anchorClassName="text-amber-800"
                                anchorText="......."
                                icon={<FontAwesomeIcon icon={faPencil} />}
                                receiveNewRecord={(res) => {
                                  setPaymentInformation(res);
                                }}
                              /> */}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center relative rounded bg-white shadow px-2 py-4">
                      <div className="text-2xl text-teal-800 h-12 w-12 flex items-center justify-center">
                        <DoorbellSharp />
                      </div>
                      <div className="flex flex-col">
                        <span>Paid Amount</span>
                        <span className="text-teal-800 font-bold">
                          {formatCurrency(Number(paid_amount))}
                        </span>
                        <div className="absolute shadow-md shadow-gray-700/10 hover:shadow-xl hover:shadow-gray-800/50 hover:scale-105 duration-300 rounded-lg px-2 py-1 right-2">
                          {/* <EditModal
                                description="Paid Amount"
                                dataEndpoint={endpoints.cases.getPaymentInformation.replace(
                                  "<:caseId>",
                                  casey.id
                                )}
                                updateEndpoint={endpoints.cases.patchPaymentInformation.replace(
                                  "<:caseId>",
                                  casey.id
                                )}
                                editableFields={[
                                  { name: "paid_amount", as: "number" },
                                ]}
                                anchorClassName="text-amber-800"
                                anchorText="......."
                                icon={<FontAwesomeIcon icon={faPencil} />}
                                receiveNewRecord={(res) => {
                                  setPaymentInformation(res);
                                }}
                              /> */}
                        </div>
                      </div>
                    </div>
                  </Masonry>

                  {cummulative_payments && cummulative_payments.length > 0 && (
                    <div className="">
                      <h3 className="text-teal-900 font-semibold">
                        Cummulative Payments
                      </h3>
                      <div className="bg-white rounded shadow py-4">
                        <table className="w-full text-sm">
                          <thead className="">
                            <tr className="">
                              <th className="truncate text-start px-4">
                                Amount
                              </th>
                              <th className="truncate text-start px-2">
                                Payment Type
                              </th>
                              <th className="truncate text-start px-2">
                                Payment Method
                              </th>
                              <th className="truncate text-start px-2">Date</th>
                              <th className="truncate  text-start px-2">
                                Time
                              </th>
                              <th className="px-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {cummulative_payments.map((payment, index) => (
                              <tr key={index} className="border-t">
                                <td className="px-4 py-1 truncate">
                                  {formatCurrency(Number(payment.amount) || 0)}
                                </td>
                                <td className="px-2 py-1 truncate">
                                  {payment.payment_type}
                                </td>
                                <td className="px-2 py-1 truncate">
                                  {payment.payment_method}
                                </td>
                                <td className="px-2 py-1 truncate">
                                  {new Date(payment.created_at).toDateString()}
                                </td>
                                <td className="px-2 py-1 truncate">
                                  {new Date(
                                    payment.created_at
                                  ).toLocaleTimeString()}
                                </td>
                                <td className="px-2 py-1 inline-flex items-center">
                                  <ManualModal
                                    anchorClassName="inline-block cursor-pointer text-teal-900 hover:text-teal-700 duration-300"
                                    anchorContent={
                                      <>
                                        <PencilSquareIcon height={16} />
                                      </>
                                    }
                                  >
                                    <form></form>
                                  </ManualModal>
                                  <ManualModal
                                    anchorClassName="inline-block cursor-pointer text-gray-500 hover:text-red-800 duration-300"
                                    anchorContent={
                                      <>
                                        <TrashIcon height={16} />
                                      </>
                                    }
                                  >
                                    <form></form>
                                  </ManualModal>
                                  {/* <EditModal
                                          receiveNewRecord={
                                            handleCumulativePaymentChange
                                          }
                                          editableFields={[
                                            {
                                              name: "payment_method",
                                              as: "select",
                                              options: paymentMethods.map(
                                                (paymentMethod) => ({
                                                  value: paymentMethod,
                                                  label: paymentMethod,
                                                })
                                              ),
                                              label: "Payment Method",
                                            },
                                            {
                                              name: "payment_type",
                                              as: "select",
                                              options: [
                                                "final",
                                                "installment",
                                                "deposit",
                                              ].map((paymentMethod) => ({
                                                value: paymentMethod,
                                                label:
                                                  capitalize(paymentMethod),
                                              })),
                                              label: "Payment Type",
                                            },
                                            { name: "amount", as: "number" },
                                          ]}
                                          updateEndpoint={endpoints.payments.crud.replace(
                                            "<:id>",
                                            payment.id
                                          )}
                                          dataEndpoint={endpoints.payments.crud.replace(
                                            "<:id>",
                                            payment.id
                                          )}
                                          anchorText=""
                                          description="Edit Payment Details"
                                          icon={
                                            <FontAwesomeIcon icon={faPen} />
                                          }
                                          anchorClassName="p-1 rounded line-shadow-on-hover"
                                        />
                                        <DeleteModal
                                          endpoint={endpoints.payments.crud.replace(
                                            "<:id>",
                                            payment.id
                                          )}
                                          receiveResponse={(res) => {
                                            setPaymentInformation(res);
                                          }}
                                          anchorText=""
                                          description="Delete Payment"
                                          anchorClassName="p-1 rounded line-shadow-on-hover"
                                        /> */}
                                </td>
                              </tr>
                            ))}

                            {/* <div className="flex justify-end px-4 pt-3 pb-2">
                            <AddInstallment
                              {...{
                                id: casey.id,
                                title: casey.title,
                                description: casey.description,
                                addInstallment: addInstallment,
                              }}
                            />
                          </div> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return (
            <div className="shadow rounded">
              <Alert severity="warning">
                <h4>Payment information not initialized yet.</h4>
                <div className="">
                  <InitializePaymentInformation
                    caseId={caseId}
                    onSubmit={submitInitialPaymentInformation}
                    anchorClassName="inline-block text-teal-900 font-semibold hover:text-teal-700 duration-300 cursor-pointer"
                    anchorContent="Click here"
                  />
                  &nbsp; to initalize.
                </div>
              </Alert>
            </div>
          );
        }

        return <div></div>;
      }}
    />
  );
}

function ClientDetails({ client_id }: { client_id: string }) {
  const handleRequest = useAPI();
  const clientKey = `${TANSTACK_QUERY_KEYS.CLIENT_DETAILS}#${client_id}`;
  return (
    <TanstackSuspense
      fallback={<ClientDetailsSkeleton />}
      queryKey={[clientKey]}
      queryFn={() =>
        handleRequest<Client>({
          func: axiosGet,
          args: [APIS.clients.getClient.replace("<:clientId>", client_id)],
        })
      }
      RenderData={({ data }) => {
        if (data.status === "ok" && data.result) {
          const { name, email, address, contact_number } = data.result;

          return (
            <div>
              <div className="bg-white border-l-8 border-teal-800 shadow rounded">
                <div className="">
                  <h4 className="p-2 border-b font-bold text-xl">Client</h4>
                  <div className="grid grid-cols-">
                    <div className="flex items-start border-b py-1">
                      <h4 className="px-2 min-w-44 max-w-44">Name</h4>
                      <p className="flex-grow">{name}</p>
                    </div>
                    <div className="flex items-start border-b py-1">
                      <h4 className="px-2 min-w-44 max-w-44">Email</h4>
                      <p className="flex-grow">{email}</p>
                    </div>
                    <div className="flex items-start border-b py-1">
                      <h4 className="px-2 min-w-44 max-w-44">Contact Number</h4>
                      <p className="flex-grow">{contact_number}</p>
                    </div>
                    <div className="flex items-start py-1">
                      <h4 className="px-2 min-w-44 max-w-44">Address</h4>
                      <p className="flex-grow">{address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="shadow rounded mt-2">
            <Alert severity="error">
              <span className="block">{data.errors?.status}</span>
              <span className="block">{data.errors?.error}</span>
            </Alert>
          </div>
        );
      }}
      defaultErrorClassName="p-4"
    />
  );
}
