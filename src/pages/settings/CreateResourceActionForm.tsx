import { useState } from "react";
import { InputField } from "../../ui/modals/EditModal";
import { Alert, LoadingButton } from "@mui/lab";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import useAPI from "../../hooks/useAPI";
import { axiosPost } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import {
  containsWhiteSpaceCharacter,
  startsWithUpperCase,
} from "../../lib/utils";
import { AlertResponse } from "../../ui/definitions";

export function CreateResourceActionForm({
  onNewRecord,
}: {
  onNewRecord: () => void;
}) {
  const [formData, setFormData] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);
  const handleRequest = useAPI();
  const [createRes, setCreateRes] = useState<AlertResponse | null>(null);

  const canSubmit = () =>
    !!formData.name &&
    !containsWhiteSpaceCharacter(formData.name) &&
    startsWithUpperCase(formData.name);

  const handleSubmit = () => {
    setSubmitting(true);
    handleRequest({
      func: axiosPost,
      args: [APIS.authorization.resourceActions.create, formData],
    })
      .then((res) => {
        if (res.status === "ok") {
          setCreateRes({
            status: "success",
            message: "Action created successfully",
          });
          onNewRecord();
        } else if (res.status === "422") {
          setCreateRes({ status: "error", message: res.errors.errors.name[0] });
        } else if (res.status === "error") {
          setCreateRes({
            status: "error",
            message: res.message,
          });
        }
      })
      .finally(() => setSubmitting(false));
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="grid gap-2"
    >
      {createRes && (
        <div className="border shadow overflow-hidden rounded-lg">
          <Alert severity={createRes.status}>{createRes.message}</Alert>
        </div>
      )}
      <div className="border shadow overflow-hidden rounded-lg">
        <Alert
          sx={{ paddingY: 0 }}
          severity={formData.name ? "success" : "error"}
        >
          The name of an action is required.
        </Alert>
        <Alert
          sx={{ paddingY: 0 }}
          severity={startsWithUpperCase(formData.name) ? "success" : "error"}
        >
          it must start with an uppercase character.
        </Alert>
        <Alert
          sx={{ paddingY: 0 }}
          severity={canSubmit() ? "success" : "error"}
        >
          it must not contain any white space characters.
        </Alert>
      </div>
      <InputField
        sx={MUI_STYLES.FilledInputTextField3WhiteBg}
        required
        value={formData.name || ""}
        onChange={(name) => setFormData({ name })}
        options={{
          type: "text",
        }}
        label="ActionName"
        name="name"
      />
      <LoadingButton
        disabled={!canSubmit()}
        loading={submitting}
        type="submit"
        fullWidth
        sx={MUI_STYLES.Button2}
        variant="contained"
      >
        Save
      </LoadingButton>
    </form>
  );
}
