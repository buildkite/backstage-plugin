import React from "react";
import { Box, Paper } from "@material-ui/core";

interface Step {
  id: string;
  icon?: string;
  title?: string;
  status: string;
}
interface JobProps {
  step: Step;
}

export const Job: React.FC<JobProps> = ({ step }) => {
  return (
    <Paper key={step.id}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        gridGap="8px"
        paddingX="10px"
        paddingY="14px"
      >
        {Array.isArray(step.icon)
          ? step.icon.map((iconSrc, index) => (
              <img
                key={index}
                height="16"
                width="16"
                src={iconSrc}
                alt={step.title}
                className="emoji"
              />
            ))
          : step.icon && (
              <img
                height="16"
                width="16"
                src={step.icon}
                alt={step.title}
                className="emoji"
              />
            )}
        {step.title} - {step.status}
      </Box>
    </Paper>
  );
};
