import { useEffect, useState } from "react";
import InputSelection, { InputOption } from "../InputSelection";
import { ManualModal } from "./ManualModal";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { Button, SxProps, TextField, Theme } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export type InputFieldType = "text" | "number" | "select" | "textarea";

export interface TextFieldOptions {
  type: "text" | "number";
}

export interface SelectableFieldOptions {
  type: "select";
  options: InputOption[];
}

export interface TextareaFieldOptions {
  type: "textarea";
  rows?: number;
}

export type FieldOptions =
  | SelectableFieldOptions
  | TextFieldOptions
  | TextareaFieldOptions;

export interface EditableFieldOptions {
  name: string;
  label: string;
  required?: boolean;
  options: FieldOptions;
  sx?: SxProps<Theme>;
}

export interface ControlledMuiFieldOptions extends EditableFieldOptions {
  enabled?: boolean;
  value: string | number;
  onChange: (newValue: string) => void;
}

export function InputField({
  enabled = true,
  name,
  options,
  label,
  required,
  value,
  onChange,
  sx = MUI_STYLES.FilledInputTextField3,
}: ControlledMuiFieldOptions) {
  return options.type === "select" ? (
    <InputSelection
      enabled={enabled}
      required={required}
      name={name}
      label={label}
      sx={sx}
      options={options.options}
      value={value}
      onChange={(v) => onChange(v)}
    />
  ) : (
    <TextField
      type={options.type}
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={sx}
      variant="filled"
      margin="none"
      required={required}
      fullWidth
      id="identity"
      label={label}
      name={label}
      multiline={options.type === "textarea"}
      rows={options.type === "textarea" ? options.rows || 4 : undefined}
    />
  );
}

export function InputFields<T extends Record<string, string | number>>({
  data,
  editableFields,
  onChange,
}: {
  data: T;
  editableFields: EditableFieldOptions[];
  onChange: (k: string, v: string, type: InputFieldType) => void;
}) {
  return (
    <>
      {editableFields.map(({ name, options, label, required, sx }, index) => (
        <InputField
          sx={sx}
          key={index}
          name={name}
          options={options}
          label={label}
          required={required}
          value={data[name] || ""}
          onChange={(newValue) => onChange(name, newValue, options.type)}
        />
      ))}
    </>
  );
}

export function EditModal<T extends Record<string, string | number>>({
  initial,
  className,
  onSubmit,
  anchorClassName,
  anchorContent,
  editableFields,
  title,
  children,
}: {
  title?: React.ReactNode;
  initial: T;
  editableFields: EditableFieldOptions[];
  className?: string;
  onSubmit: (changes: Record<string, string | number>) => Promise<boolean>;
  anchorClassName?: string;
  anchorContent?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const [waitingSubmission, setWaitingSubmission] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<T>(initial);
  const [changes, setChanges] = useState<string[]>([]);

  useEffect(() => {
    setFormData(initial);
  }, [open, initial]);

  return (
    <ManualModal
      state={[open, setOpen]}
      anchorClassName={anchorClassName}
      anchorContent={anchorContent}
    >
      <form
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          const recordedChanges: Record<string, string | number> = {};
          setWaitingSubmission(true);
          onSubmit(
            changes.reduce((acc, curr) => {
              acc[curr] = formData[curr];
              return acc;
            }, recordedChanges)
          )
            .then((res) => {
              setOpen(!!!res);
            })
            .finally(() => {
              setWaitingSubmission(false);
            });
        }}
      >
        {title}
        <InputFields
          editableFields={editableFields}
          onChange={(k, v, t) => {
            if (t === "select") {
              setFormData((p) => ({ ...p, [k]: v }));
            } else {
              setFormData((p) => ({
                ...p,
                [k]: t === "number" ? Number(v) : v,
              }));
            }
            if (!changes.includes(k)) {
              setChanges((ch) => [...ch, k]);
            }
          }}
          data={formData}
        />

        {children}

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
            fullWidth
            variant="contained"
            sx={MUI_STYLES.Button2}
          >
            Cancel
          </Button>
          <LoadingButton
            disabled={
              changes.length < 1 ||
              editableFields.some((f) => f.required && !!!formData[f.name])
            }
            loading={waitingSubmission}
            sx={MUI_STYLES.Button2}
            type="submit"
            fullWidth
            variant="contained"
          >
            Save Changes
          </LoadingButton>
        </div>
      </form>
    </ManualModal>
  );
}
