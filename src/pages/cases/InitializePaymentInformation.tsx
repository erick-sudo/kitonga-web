import { useState } from "react";
import {
  InitializePaymentInformationDto,
  Payment,
  PaymentType,
} from "../../lib/definitions";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { ManualModal } from "../../ui/modals/ManualModal";
import { Alert, TextField } from "@mui/material";
import InputSelection from "../../ui/InputSelection";
import { LoadingButton } from "@mui/lab";
import { AddPayment } from "./AddPayment";
import { formatCurrency } from "../../lib/utils";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Add } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";

export function InitializePaymentInformation({
  caseId,
  anchorContent,
  anchorClassName,
  onSubmit,
}: {
  anchorContent: any;
  anchorClassName: string;
  caseId: string;
  onSubmit: (p: InitializePaymentInformationDto) => Promise<any>;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [paymentInformation, setPaymentInformation] =
    useState<InitializePaymentInformationDto>({
      payment_type: "full",
      total_fee: 0,
      payment: null,
    });
  const [payment, setPayment] = useState<Payment>({
    amount: 0,
    payment_method: "Cash",
    payment_type: "installment",
  });
  const [error, setError] = useState("");

  const updatePayment = (newPayment: Payment | null) => {
    setPaymentInformation({
      ...paymentInformation,
      payment: newPayment,
    });
  };

  return (
    <ManualModal
      anchorClassName={anchorClassName}
      anchorContent={<>{anchorContent}</>}
    >
      {error && (
        <div className="w-[18rem]">
          <Alert severity="error">{error}</Alert>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          onSubmit(paymentInformation)
            .then((res) => {
              if (res.status === "ok") {
                queryClient.invalidateQueries({
                  queryKey: [
                    `${TANSTACK_QUERY_KEYS.PAYMENT_INFORMATION_DETAILS}#${caseId}`,
                  ],
                });
                setError("");
              } else {
                if (res.status === "409") {
                  setError(res.errors.message);
                } else {
                  setError("Could not initialize payment information");
                }
              }
            })
            .finally(() => setLoading(false));
        }}
        className="grid gap-4 py-4 min-w-[18rem]"
      >
        <h3>Initialize Payment Information</h3>
        <TextField
          size="small"
          value={paymentInformation.total_fee || ""}
          onChange={(e) => {
            setPaymentInformation({
              ...paymentInformation,
              total_fee: Number(e.target.value) || 0,
            });
          }}
          sx={MUI_STYLES.FilledInputTextField3}
          variant="filled"
          margin="none"
          required
          fullWidth
          name="total_fee"
          label="Total Fee"
          type="number"
        />

        <InputSelection
          label="Payment Type"
          name="payment-type"
          value={paymentInformation.payment_type}
          onChange={(newType) => {
            setPaymentInformation({
              ...paymentInformation,
              payment_type: newType as PaymentType,
            });
          }}
          options={["full", "installment"].map((t) => ({
            name: t,
            value: t,
            level: 0,
            type: "item",
          }))}
        />

        {/* ------- Down Payment -------- */}
        {paymentInformation.payment_type === "installment" && (
          <div className="grid gap-2">
            <h3 className="flex justify-between items-center">
              <span>Payment</span>{" "}
              <button
                onClick={() => updatePayment(null)}
                type="button"
                className="flex items-center gap-1 text-sm text-teal-900 hover:text-teal-700 duration-300"
              >
                <TrashIcon height={16} /> Clear
              </button>
            </h3>
            {paymentInformation.payment ? (
              <div className="text-sm rounded-lg border">
                <div className="flex px-2 border-b">
                  <span className="w-28 border-r py-1">Payment Method</span>
                  <span className="pl-2 py-1 flex flex-1 items-center justify-between">
                    <span>{paymentInformation.payment.payment_method}</span>
                    <AddPayment
                      state={[payment, setPayment]}
                      updatePayment={updatePayment}
                      anchorClassName="text-teal-900 w-max cursor-pointer hover:text-teal-600 duration-300"
                      anchorContent={
                        <>
                          <PencilSquareIcon height={16} />
                        </>
                      }
                    />
                  </span>
                </div>
                <div className="flex px-2 border-b">
                  <span className="w-28 border-r py-1">Payment Type</span>
                  <span className="pl-2 py-1 flex flex-1 items-center justify-between">
                    <span>{paymentInformation.payment.payment_type}</span>
                    <AddPayment
                      state={[payment, setPayment]}
                      updatePayment={updatePayment}
                      anchorClassName="text-teal-900 w-max cursor-pointer hover:text-teal-600 duration-300"
                      anchorContent={
                        <>
                          <PencilSquareIcon height={16} />
                        </>
                      }
                    />
                  </span>
                </div>
                <div className="flex px-2">
                  <span className="w-28 border-r py-1">Amount</span>
                  <span className="pl-2 py-1 flex flex-1 items-center justify-between">
                    <span>
                      {formatCurrency(
                        Number(paymentInformation.payment.amount) || 0
                      )}
                    </span>
                    <AddPayment
                      state={[payment, setPayment]}
                      updatePayment={updatePayment}
                      anchorClassName="text-teal-900 w-max cursor-pointer hover:text-teal-600 duration-300"
                      anchorContent={
                        <>
                          <PencilSquareIcon height={16} />
                        </>
                      }
                    />
                  </span>
                </div>
              </div>
            ) : (
              <AddPayment
                state={[payment, setPayment]}
                updatePayment={updatePayment}
                anchorClassName="flex items-center gap-2 px-4 text-sm py-1 bg-teal-800 w-max cursor-pointer text-white rounded-lg hover:bg-teal-600 duration-300"
                anchorContent={
                  <>
                    <Add fontSize="small" /> <span>Payment</span>
                  </>
                }
              />
            )}
          </div>
        )}
        <div className="">
          <LoadingButton
            loading={loading}
            sx={{
              ...MUI_STYLES.Button,
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
            type="submit"
            fullWidth
            variant="contained"
          >
            Submit
          </LoadingButton>
        </div>
      </form>
    </ManualModal>
  );
}
