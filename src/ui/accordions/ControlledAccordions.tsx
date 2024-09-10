import React, { useState } from "react";
import { AccordionSummary, Accordion, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface ControlledAccordionItem<S, D> {
  summary: S;
  details: D;
}

export interface ControlledAccordionsProps<S, D> {
  initial?: number;
  items: ControlledAccordionItem<S, D>[];
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

export function ControlledAccordions<S, D>({
  initial = -1,
  items = [],
  className = "",
  expandedClassName,
  Summary,
  Details,
  expand,
}: ControlledAccordionsProps<S, D>) {
  const [expanded, setExpanded] = useState<string>(`panel${initial}`);
  const ExpandIcon = expand?.ExpandIcon;
  const handleChange =
    (panel: string) =>
    (_event: React.SyntheticEvent<Element, Event>, expanded: boolean) => {
      setExpanded(expanded ? panel : "");
    };

  return (
    <>
      {items.map((item, idx) => (
        <div
          className={`${
            expanded === `panel${idx}` ? `${expandedClassName}` : `${className}`
          }`}
          key={idx}
        >
          <Accordion
            sx={{ backgroundColor: "transparent", boxShadow: "none" }}
            expanded={expanded === `panel${idx}`}
            onChange={handleChange(`panel${idx}`)}
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
                ExpandIcon ? (
                  <ExpandIcon expanded={expanded === `panel${idx}`} />
                ) : (
                  <ExpandMoreIcon />
                )
              }
              aria-controls={`panel${idx}content`}
              id={`panel${idx}header`}
            >
              <Summary
                expanded={expanded === `panel${idx}`}
                summary={item.summary}
              />
            </AccordionSummary>
            <AccordionDetails sx={{ color: "inherit" }}>
              <Details
                expanded={expanded === `panel${idx}`}
                details={item.details}
              />
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </>
  );
}
