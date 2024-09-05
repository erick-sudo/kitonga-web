import { Radio } from "@mui/material";
import React from "react";
import { MUI_STYLES } from "../lib/MUI_STYLES";

export default function KRadioGroup<T extends string>({
  value,
  labels,
  checkedIcon,
  onChange,
  name,
}: {
  labels: T[];
  checkedIcon?: React.ReactNode;
  onChange: (value: T) => void;
  value: T;
  name: string;
}) {
  return (
    <>
      {labels.map((label, index) => (
        <div key={index} className="flex items-center">
          <Radio
            checkedIcon={checkedIcon}
            onChange={() => onChange(label)}
            checked={label === value}
            size="small"
            sx={MUI_STYLES.CheckBox}
            name={name}
          />
          <span>{label}</span>
        </div>
      ))}
    </>
  );
}
