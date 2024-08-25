import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  SxProps,
  Theme,
} from "@mui/material";
import { MUI_STYLES } from "../lib/MUI_STYLES";

export interface InputOption {
  name: string | number;
  level: number;
  value: string | number;
  type: "item" | "label";
}

interface InputSelectionProps {
  ItemTemplate?: React.FC<{ option: InputOption }>;
  LabelTemplate?: React.FC<{ option: InputOption }>;
  labelClassName?: string;
  enabled?: boolean;
  name: string;
  options: InputOption[];
  value: any;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  sx?: SxProps<Theme>;
}

export default function InputSelection({
  ItemTemplate,
  LabelTemplate,
  labelClassName,
  enabled = true,
  name,
  options = [],
  value,
  label,
  onChange,
  required,
  sx = MUI_STYLES.FilledInputTextField3,
}: InputSelectionProps) {
  return (
    <FormControl
      required={required}
      variant="filled"
      sx={{ m: 0, ...sx }}
      fullWidth
      size="small"
    >
      <InputLabel size="small">{label}</InputLabel>
      <Select
        disabled={!enabled}
        name={name}
        required={required}
        value={value}
        label={label}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {options.map((option, index) =>
          option.type === "item" ? (
            ItemTemplate ? (
              <ItemTemplate option={option} key={index} />
            ) : (
              <MenuItem
                sx={{
                  marginLeft: (option.level || 0) * 2,
                }}
                value={option.value}
                key={index}
              >
                {option.name}
              </MenuItem>
            )
          ) : LabelTemplate ? (
            <LabelTemplate option={option} key={index} />
          ) : (
            <span
              key={index}
              style={{
                marginLeft: (option.level || 0) * 2,
              }}
              className={`px-4 py-1 block w-full font-bold ${labelClassName}`}
            >
              {option.name}
            </span>
          )
        )}
      </Select>
    </FormControl>
  );
}
