import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Chip } from "@material-ui/core";
import { BuildStepParams } from "../Types";
import { StatusIcon } from "../Icons";

type BuildStepProps = {
  step: BuildStepParams;
};

const useStyles = makeStyles({
  icon: {
    marginRight: "8px",
  },
  truncate: {
    maxWidth: "12em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "@keyframes spin": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
  animationSpinSlow: {
    animation: "$spin 2s linear infinite",
  },
  statusIcon: {
    display: "flex",
    alignItems: "center",
    marginRight: "14px",
  },
  buildStep: {
    color: "#737373",
    borderRadius: "4px",
    margin: 0,
  },
  passed: {
    borderColor: "#00be141c",
    backgroundColor: "#f4f9f5",
    color: "#00522b",
  },
  failed: {
    borderColor: "#f83f23",
    backgroundColor: "#fdf5f5",
    color: "#00522b",
  },
  running: {
    borderColor: "#FFBA11",
    backgroundColor: "#FFF8E7",
    color: "#111111",
  },
});

export const BuildStep: React.FC<BuildStepProps> = ({ step }) => {
  const classes = useStyles();

  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  const getStatusClass = (status: BuildStepParams["status"]) => {
    switch (status) {
      case "PASSED":
        return classes.passed;
      case "FAILED":
        return classes.failed;
      case "RUNNING":
        return classes.running;
      default:
        return "";
    }
  };

  return (
    <Chip
      className={`${classes.buildStep} ${getStatusClass(step.status)}`}
      style={{ paddingLeft: "4px" }}
      icon={
        <Box className={classes.statusIcon}>
          <StatusIcon status={step.status} size="small" />
          {step.icon && (
            <img
              height="16"
              width="16"
              src={step.icon}
              alt={step.title}
              className="emoji"
              style={{ marginLeft: "4px" }}
            />
          )}
        </Box>
      }
      label={step.title}
      variant="outlined"
      size="small"
      onClick={handleClick}
    />
  );
};

export default BuildStep;
