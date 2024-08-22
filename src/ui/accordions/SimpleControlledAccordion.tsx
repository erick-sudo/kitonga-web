import React, { useState } from "react";
import { ControlledAccordionItem } from "./ControlledAccordions";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface SimpleAccordionItemProps<S, D> {
  initialState?: boolean;
  item: ControlledAccordionItem<S, D>;
  className?: string;
  expandedClassName?: string;
  expand?: {
    ExpandIcon?: React.FC<{ expanded: boolean }>;
    angle?: number;
    duration?: number;
  };
  Summary: React.FC<{ expanded: boolean; summary: S }>;
  Details: React.FC<{ expanded: boolean; details: D }>;
}

export function SimpleControlledAccordion<S, D>({
  initialState = false,
  item,
  className = "",
  expandedClassName,
  Summary,
  Details,
  expand,
}: SimpleAccordionItemProps<S, D>) {
  const [expanded, setExpanded] = useState(Boolean(initialState));
  const ExpandIcon = expand?.ExpandIcon;
  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    expanded: boolean
  ) => {
    setExpanded(expanded);
  };

  return (
    <div className={`${className} ${expanded && expandedClassName}`}>
      <Accordion
        sx={{ backgroundColor: "transparent", boxShadow: "none" }}
        expanded={expanded}
        onChange={handleChange}
        square
      >
        <AccordionSummary
          sx={{
            "& .MuiAccordionSummary-expandIconWrapper": {
              transition: `transform ${expand?.duration || 0.3}s`,
            },
            "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
              transform: `rotate(-${expand?.angle || 90}deg)`,
            },
          }}
          expandIcon={
            ExpandIcon ? <ExpandIcon expanded={expanded} /> : <ExpandMoreIcon />
          }
        >
          <Summary expanded={expanded} summary={item.summary} />
        </AccordionSummary>
        <AccordionDetails sx={{ color: "inherit" }}>
          <Details expanded={expanded} details={item.details} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
