import { useState } from "react";
import { Payment, PaymentMethod, PaymentType } from "../../lib/definitions";
import { ReactState } from "../../ui/definitions";
import { ManualModal } from "../../ui/modals/ManualModal";
import { Button, TextField } from "@mui/material";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import InputSelection from "../../ui/InputSelection";
import { capitalize } from "../../lib/utils";

export function AddPayment({
  anchorContent,
  anchorClassName,
  updatePayment,
  state: [payment, setPayment] = useState<Payment>({
    amount: 0,
    payment_method: "Cash",
    payment_type: "installment",
  }),
}: {
  anchorContent: any;
  anchorClassName: string;
  updatePayment: (p: Payment) => void;
  state?: ReactState<Payment>;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <ManualModal
      anchorClassName={anchorClassName}
      anchorContent={<>{anchorContent}</>}
      state={[openModal, setOpenModal]}
    >
      <div className="grid gap-4 py-4 min-w-[18rem]">
        <h3>Set Payment</h3>

        <InputSelection
          label="Payment Method"
          name="payment_method"
          value={payment.payment_method}
          onChange={(newMethod) => {
            setPayment({
              ...payment,
              payment_method: newMethod as PaymentMethod,
            });
          }}
          options={["Cash", "Mpesa", "CreditCard", "DebitCard"].map((t) => ({
            name: t,
            value: t,
            level: 0,
            type: "item",
          }))}
        />

        <InputSelection
          label="Payment Type"
          name="payment-type"
          value={payment.payment_type}
          onChange={(newType) => {
            setPayment({
              ...payment,
              payment_type: newType as PaymentType,
            });
          }}
          options={["deposit", "full", "installment"].map((t) => ({
            name: capitalize(t),
            value: t,
            level: 0,
            type: "item",
          }))}
        />

        <TextField
          size="small"
          value={Number(payment.amount) || ""}
          onChange={(e) => {
            setPayment({
              ...payment,
              amount: Number(e.target.value),
            });
          }}
          sx={MUI_STYLES.FilledInputTextField3}
          variant="filled"
          margin="none"
          required
          fullWidth
          name="amount"
          label="Amount"
          type="number"
        />

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}
            sx={{
              ...MUI_STYLES.Button,
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              updatePayment(payment);
              setOpenModal(false);
            }}
            type="button"
            sx={{
              ...MUI_STYLES.Button,
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
          >
            Set
          </Button>
        </div>
      </div>
    </ManualModal>
  );
}
