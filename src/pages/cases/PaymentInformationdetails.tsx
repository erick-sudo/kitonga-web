import {
  InitializePaymentInformationDto,
  Installment,
  Payment,
  PaymentInformation,
} from "../../lib/definitions";
import { TanstackSuspense } from "../../ui/TanstackSuspense";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import useAPI from "../../hooks/useAPI";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { Alert, CircularProgress } from "@mui/material";
import { PaymentListSkeleton } from "../../ui/Skeletons";
import { InitializePaymentInformation } from "./InitializePaymentInformation";
import {
  PencilSquareIcon,
  TrashIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import {
  Add,
  DoorbellSharp,
  MonetizationOn,
  Summarize,
} from "@mui/icons-material";
import { Progress } from "../../ui/Progress";
import { KitongaColorScheme } from "../../lib/MUI_STYLES";
import { Masonry } from "@mui/lab";
import {
  capitalize,
  formatCurrency,
  snakeCaseToTitleCase,
} from "../../lib/utils";
import { EditModal } from "../../ui/modals/EditModal";
import { useQueryClient } from "@tanstack/react-query";
import { AddPayment } from "./AddPayment";
import { useContext, useState } from "react";
import { paymentMethods } from "../../lib/data";
import DeleteModal from "../../ui/modals/DeleteModal";
import { AlertContext } from "../Dashboard";
import { AlertResponse } from "../../ui/definitions";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";

export function PaymentInformationDetails({ caseId }: { caseId: string }) {
  const handleRequest = useAPI();
  const paymentInformationKey = `${TANSTACK_QUERY_KEYS.PAYMENT_INFORMATION_DETAILS}#${caseId}`;
  const queryClient = useQueryClient();
  const [addingInstallment, setAddingInstallment] = useState(false);
  const { pushAlert } = useContext(AlertContext);

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

  function addInstallment(payload: Payment) {
    setAddingInstallment(true);
    handleRequest<Installment>({
      func: axiosPost,
      args: [APIS.cases.addInstallment.replace("<:caseId>", caseId), payload],
    })
      .then((res) => {
        if (res.status === "ok") {
          queryClient.invalidateQueries({
            queryKey: [paymentInformationKey],
          });
          pushAlert(
            {
              status: "success",
              message: `New installment recorded for case ${caseId}.`,
            },
            10000
          );
        } else {
          pushAlert(
            {
              status: "error",
              message: (
                <RequestErrorsWrapperNode
                  fallbackMessage={`Sorry! an error occured while adding a new installment for this case.`}
                  requestError={res}
                />
              ),
            },
            5000
          );
        }
      })
      .finally(() => {
        setAddingInstallment(false);
      });
  }

  async function updatePaymentInformation(
    payload: Record<string, string | number>
  ) {
    return await handleRequest<PaymentInformation>({
      func: axiosPatch,
      args: [
        APIS.cases.patchPaymentInformation.replace("<:caseId>", caseId),
        payload,
      ],
    }).then((res) => {
      if (res.status === "ok") {
        queryClient.invalidateQueries({
          queryKey: [paymentInformationKey],
        });
        pushAlert(
          {
            status: "success",
            message: `The following payment information fields have been successfully updated: ${Object.keys(
              payload
            ).join(", ")}.`,
          },
          10000
        );
        return true;
      } else {
        pushAlert(
          {
            status: "error",
            message: (
              <RequestErrorsWrapperNode
                fallbackMessage={`Could not update ${Object.keys(payload).join(
                  ", "
                )}.`}
                requestError={res}
              />
            ),
          },
          5000
        );
        return false;
      }
    });
  }

  return (
    <TanstackSuspense
      fallback={<PaymentListSkeleton />}
      queryKey={[paymentInformationKey]}
      queryFn={() =>
        handleRequest<PaymentInformation | null>({
          func: axiosGet,
          args: [APIS.cases.getPaymentInformation.replace("<:caseId>", caseId)],
        })
      }
      RenderData={({ data }) => {
        if (data.status === "ok") {
          if (data.result) {
            const {
              paid_amount,
              payment_type,
              outstanding,
              total_fee,
              cummulative_payments,

              deposit,
              deposit_fees,
              deposit_pay,
              final_fees,
              final_pay,
            } = data.result;

            const extra: Record<string, string | number> = {
              deposit,
              deposit_fees,
              deposit_pay,
              final_fees,
              final_pay,
            };

            return (
              <div>
                <div className="overflow-hidden rounded">
                  <Masonry columns={{ xs: 1, sm: 3, md: 3 }}>
                    <div className="rounded shadow bg-white border p-4">
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

                    <div className="grid relative rounded bg-white border shadow p-4">
                      <div className="text-teal-800 flex items-center gap-2">
                        <Summarize />
                        <span>Total Fee</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">
                          {formatCurrency(Number(total_fee))}
                        </span>
                        <EditModal
                          className="grid gap-2"
                          anchorClassName="inline-block cursor-pointer text-teal-900 hover:text-teal-700 duration-300"
                          anchorContent={
                            <>
                              <PencilSquareIcon height={16} />
                            </>
                          }
                          initial={{ total_fee }}
                          editableFields={[
                            {
                              name: "total_fee",
                              label: "Total Fee",
                              options: { type: "number" },
                              required: true,
                            },
                          ]}
                          onSubmit={updatePaymentInformation}
                        />
                      </div>
                    </div>

                    <div className="grid relative rounded bg-white border shadow p-4">
                      <div className="text-teal-800 flex items-center gap-2">
                        <WalletIcon height={20} />
                        <span>Payment type</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{payment_type}</span>
                        <EditModal
                          className="grid gap-2"
                          anchorClassName="inline-block cursor-pointer text-teal-900 hover:text-teal-700 duration-300"
                          anchorContent={
                            <>
                              <PencilSquareIcon height={16} />
                            </>
                          }
                          initial={{ payment_type }}
                          editableFields={[
                            {
                              name: "payment_type",
                              label: "Payment Type",
                              options: {
                                type: "select",
                                options: [
                                  {
                                    value: "full",
                                    name: "Full",
                                    level: 0,
                                    type: "item",
                                  },
                                  {
                                    value: "installment",
                                    name: "Installment",
                                    level: 0,
                                    type: "item",
                                  },
                                ],
                              },
                              required: true,
                            },
                          ]}
                          onSubmit={updatePaymentInformation}
                        />
                      </div>
                    </div>

                    <div className="grid relative rounded bg-white border shadow p-4">
                      <div className="text-teal-800 flex items-center gap-2">
                        <MonetizationOn />
                        <span>Outstanding</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">
                          {formatCurrency(Number(outstanding))}
                        </span>
                        <EditModal
                          className="grid gap-2"
                          anchorClassName="inline-block cursor-pointer text-teal-900 hover:text-teal-700 duration-300"
                          anchorContent={
                            <>
                              <PencilSquareIcon height={16} />
                            </>
                          }
                          initial={{ outstanding }}
                          editableFields={[
                            {
                              name: "outstanding",
                              label: "Outstanding",
                              options: { type: "number" },
                              required: true,
                            },
                          ]}
                          onSubmit={updatePaymentInformation}
                        />
                      </div>
                    </div>

                    <div className="grid relative rounded bg-white border shadow p-4">
                      <div className="text-teal-800 flex items-center gap-2">
                        <DoorbellSharp />
                        <span>Paid Amount</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">
                          {formatCurrency(Number(paid_amount))}
                        </span>
                        <EditModal
                          className="grid gap-2"
                          anchorClassName="inline-block cursor-pointer text-teal-900 hover:text-teal-700 duration-300"
                          anchorContent={
                            <>
                              <PencilSquareIcon height={16} />
                            </>
                          }
                          initial={{ paid_amount }}
                          editableFields={[
                            {
                              name: "paid_amount",
                              label: "Paid Amount",
                              options: { type: "number" },
                              required: true,
                            },
                          ]}
                          onSubmit={updatePaymentInformation}
                        />
                      </div>
                    </div>
                  </Masonry>

                  {/*  */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 pr-2">
                    {[
                      "deposit",
                      "deposit_fees",
                      "deposit_pay",
                      "final_fees",
                      "final_pay",
                    ].map((k, index) => (
                      <div
                        key={index}
                        className="flex border rounded bg-white shadow overflow-hidden"
                      >
                        <h4 className="px-4 py-1 border-r w-40">
                          {snakeCaseToTitleCase(k)}
                        </h4>
                        <div className="px-4 flex-grow">
                          {formatCurrency(Number(extra[k]) || 0) || "_"}
                        </div>
                        <EditModal
                          className="grid gap-2"
                          anchorClassName="px-2 flex items-center inline-block cursor-pointer text-teal-900 hover:bg-teal-800 hover:text-white duration-300"
                          anchorContent={
                            <>
                              <PencilSquareIcon height={16} />
                            </>
                          }
                          initial={{ [k]: extra[k] || "" }}
                          editableFields={[
                            {
                              name: k,
                              label: snakeCaseToTitleCase(k),
                              options: { type: "number" },
                              required: true,
                            },
                          ]}
                          onSubmit={updatePaymentInformation}
                        />
                      </div>
                    ))}
                  </div>

                  {payment_type !== "full" && cummulative_payments && (
                    <div className="mt-4 grid gap-2">
                      <h3 className="text-teal-900 font-semibold">
                        Installments
                      </h3>
                      <div className="p-2 bg-white rounded shadow overflow-hidden">
                        <div className="horizontal-scrollbar pb-2">
                          <table className="w-full text-sm border">
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
                                <th className="truncate text-start px-2">
                                  Created At
                                </th>
                                <th className="truncate  text-start px-2">
                                  Last Updated
                                </th>
                                <th className="px-2"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {cummulative_payments.map(
                                (
                                  {
                                    id,
                                    amount,
                                    payment_type,
                                    payment_method,
                                    created_at,
                                    updated_at,
                                  },
                                  index
                                ) => (
                                  <tr key={index} className="border-t">
                                    <td className="px-4 py-1 truncate">
                                      {formatCurrency(Number(amount) || 0)}
                                    </td>
                                    <td className="px-2 py-1 truncate">
                                      {payment_type}
                                    </td>
                                    <td className="px-2 py-1 truncate">
                                      {payment_method}
                                    </td>
                                    <td className="px-2 py-1 truncate">
                                      {new Date(created_at).toDateString()}
                                      &nbsp;at&nbsp;
                                      {new Date(
                                        created_at
                                      ).toLocaleTimeString()}
                                    </td>
                                    <td className="px-2 py-1 truncate">
                                      {new Date(updated_at).toDateString()}
                                      &nbsp;at&nbsp;
                                      {new Date(
                                        updated_at
                                      ).toLocaleTimeString()}
                                    </td>
                                    <td className="px-2 py-1 inline-flex gap-2 items-center">
                                      <EditModal
                                        title={<h3>Modify Installment</h3>}
                                        className="grid gap-2"
                                        anchorClassName="inline-block cursor-pointer text-teal-900 hover:text-teal-700 duration-300"
                                        anchorContent={
                                          <>
                                            <PencilSquareIcon height={16} />
                                          </>
                                        }
                                        editableFields={[
                                          {
                                            name: "payment_method",
                                            label: "Payment Method",
                                            options: {
                                              type: "select",
                                              options: paymentMethods.map(
                                                (t) => ({
                                                  name: t,
                                                  value: t,
                                                  level: 0,
                                                  type: "item",
                                                })
                                              ),
                                            },
                                            required: true,
                                          },
                                          {
                                            name: "payment_type",
                                            label: "Payment Type",
                                            options: {
                                              type: "select",
                                              options: [
                                                "deposit",
                                                "full",
                                                "installment",
                                              ].map((t) => ({
                                                name: capitalize(t),
                                                value: t,
                                                level: 0,
                                                type: "item",
                                              })),
                                            },
                                            required: true,
                                          },
                                          {
                                            name: "amount",
                                            label: "Amount",
                                            options: { type: "number" },
                                            required: true,
                                          },
                                        ]}
                                        onSubmit={async (payload) => {
                                          return await handleRequest<Installment>(
                                            {
                                              func: axiosPatch,
                                              args: [
                                                APIS.payments.crud.replace(
                                                  "<:id>",
                                                  id
                                                ),
                                                payload,
                                              ],
                                            }
                                          ).then((res) => {
                                            if (res.status === "ok") {
                                              queryClient.invalidateQueries({
                                                queryKey: [
                                                  paymentInformationKey,
                                                ],
                                              });
                                              pushAlert(
                                                {
                                                  status: "success",
                                                  message: `You have succesfully updated installment details for ${id}.`,
                                                },
                                                10000
                                              );
                                              return true;
                                            } else {
                                              pushAlert(
                                                {
                                                  status: "success",
                                                  message: (
                                                    <RequestErrorsWrapperNode
                                                      fallbackMessage={`Sorry, could not update detaisl for this installment: ${id}`}
                                                      requestError={res}
                                                    />
                                                  ),
                                                },
                                                10000
                                              );
                                              return false;
                                            }
                                          });
                                        }}
                                        initial={{
                                          amount,
                                          payment_type,
                                          payment_method,
                                        }}
                                      />
                                      <DeleteModal
                                        passKey="delete installment"
                                        anchorClassName="inline-block cursor-pointer text-red-900 hover:text-red-700 duration-300"
                                        anchorContent={
                                          <>
                                            <TrashIcon height={16} />
                                          </>
                                        }
                                        onSubmit={() =>
                                          handleRequest<null>({
                                            func: axiosDelete,
                                            args: [
                                              APIS.payments.crud.replace(
                                                "<:id>",
                                                id
                                              ),
                                            ],
                                          }).then((res) => {
                                            queryClient.invalidateQueries({
                                              queryKey: [paymentInformationKey],
                                            });
                                            let rs: AlertResponse;
                                            if (res.status === "ok") {
                                              rs = {
                                                status: "success",
                                                message:
                                                  "Installment deleted successfully.",
                                              };
                                            } else {
                                              rs = {
                                                status: "error",
                                                message: (
                                                  <RequestErrorsWrapperNode
                                                    fallbackMessage="Failed to delete installment!"
                                                    requestError={res}
                                                  />
                                                ),
                                              };
                                            }

                                            pushAlert(rs, 10000);

                                            return rs;
                                          })
                                        }
                                      >
                                        <h3>
                                          You are about to delete this
                                          installment
                                        </h3>
                                        <div className="border rounded text-sm">
                                          <div className="flex items-start">
                                            <span className=" w-36 px-4 py-1 border-r">
                                              ID
                                            </span>
                                            <span className="flex-grow px-4 py-1 break-all">
                                              {id}
                                            </span>
                                          </div>
                                          <div className="border-t flex items-start">
                                            <span className="w-36 px-4 py-1 border-r">
                                              Payment Method
                                            </span>
                                            <span className="flex-grow px-4 py-1">
                                              {payment_method}
                                            </span>
                                          </div>
                                          <div className="border-t flex items-start">
                                            <span className="w-36 px-4 py-1 border-r">
                                              Payment Type
                                            </span>
                                            <span className="flex-grow px-4 py-1">
                                              {payment_type}
                                            </span>
                                          </div>
                                          <div className="border-t flex items-start">
                                            <span className="w-36 px-4 py-1 border-r">
                                              Amount
                                            </span>
                                            <span className="flex-grow px-4 py-1">
                                              {formatCurrency(
                                                Number(amount) || 0
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </DeleteModal>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        {addingInstallment ? (
                          <div className="text-white cursor-not-allowed bg-gray-300 w-52 flex items-center px-4 py-1 justify-center rounded">
                            <CircularProgress size={20} color="inherit" />
                          </div>
                        ) : (
                          <AddPayment
                            submitText="Submit"
                            title={<h3>New Installment</h3>}
                            updatePayment={addInstallment}
                            anchorClassName="flex items-center gap-2 w-52 text-white px-4 rounded text-sm py-1 bg-teal-800 w-max cursor-pointer hover:bg-teal-600 duration-300"
                            anchorContent={
                              <>
                                <Add height={16} />
                                <span>New Installment</span>
                              </>
                            }
                          />
                        )}
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

        return (
          <div className="rounded border shadow overflow-hidden">
            <Alert severity="error">
              <RequestErrorsWrapperNode
                fallbackMessage="Failed to fetch payment information!"
                requestError={data}
              />
            </Alert>
          </div>
        );
      }}
    />
  );
}
