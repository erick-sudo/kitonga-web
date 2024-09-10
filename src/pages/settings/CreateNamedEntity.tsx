import { useState } from "react";
import { InputField } from "../../ui/modals/EditModal";
import { Alert, LoadingButton } from "@mui/lab";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import useAPI from "../../hooks/useAPI";
import { axiosPost } from "../../lib/axiosLib";
import {
  containsWhiteSpaceCharacter,
  startsWithUpperCase,
} from "../../lib/utils";
import { AlertResponse } from "../../ui/definitions";
import { Divider } from "@mui/material";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";

export function CreateNamedEntity({
  onNewRecord,
  entity,
  endpoint,
}: {
  onNewRecord: () => void;
  endpoint: string;
  entity: string;
}) {
  const [formData, setFormData] = useState<{
    name: string;
    description?: string;
  }>({ name: "", description: "" });
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
      args: [endpoint, formData],
    })
      .then((res) => {
        if (res.status === "ok") {
          setCreateRes({
            status: "success",
            message: `${entity} created successfully`,
          });
          onNewRecord();
        } else {
          setCreateRes({
            status: "error",
            message: (
              <RequestErrorsWrapperNode
                fallbackMessage={`Could not create ${entity}`}
                requestError={res}
              />
            ),
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
        <>
          <div className="border shadow overflow-hidden rounded-lg">
            <Alert severity={createRes.status}>{createRes.message}</Alert>
          </div>
          <Divider />
        </>
      )}
      <div className="border shadow overflow-hidden rounded-lg">
        <Alert
          sx={{ paddingY: 0 }}
          severity={formData.name ? "success" : "error"}
        >
          The name is required.
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
        onChange={(name) => setFormData((p) => ({ ...p, name }))}
        options={{
          type: "text",
        }}
        label={`${entity} Name`}
        name="name"
      />

      <InputField
        sx={MUI_STYLES.FilledInputTextField3WhiteBg}
        value={formData.description || ""}
        onChange={(description) => setFormData((p) => ({ ...p, description }))}
        options={{
          type: "textarea",
        }}
        label="Description"
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
