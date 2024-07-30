import React from "react";
import { Box, Paper } from "@material-ui/core";

interface Step {
  id: string;
  icon: string;
  title: string;
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
        gridGap="8px"
        paddingX="10px"
        paddingY="14px"
      >
        <img src={step.icon} alt={step.title} width="20" height="20" />{" "}
        {step.title} - {step.status}
      </Box>
    </Paper>
  );
};
