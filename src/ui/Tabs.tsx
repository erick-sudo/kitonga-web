import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import React from "react";
import { MUI_STYLES } from "../lib/MUI_STYLES";

export default function KTabs({
  items,
}: {
  items: { label: React.ReactNode; panel: React.ReactNode }[];
}) {
  const [value, setValue] = React.useState("0");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabList sx={MUI_STYLES.TabList} onChange={handleChange} aria-label="lab API tabs example">
        {items.map(({ label }, index) => (
          <Tab sx={MUI_STYLES.Tab} key={index} label={label} value={`${index}`} />
        ))}
      </TabList>
      {items.map(({ panel }, index) => (
        <TabPanel key={index} value={`${index}`}>
          {panel}
        </TabPanel>
      ))}
    </TabContext>
  );
}
