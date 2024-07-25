import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Chip } from "@material-ui/core";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";

export type BuildStep = {
  id: string;
  title: string;
  icon: string;
  status: "passed" | "failed" | "running";
  url: string;
};

type BuildStepProps = {
  step: BuildStep;
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

  const getStatusIcon = (status: BuildStep["status"]) => {
    switch (status) {
      case "passed":
        return (
          <DoneIcon fontSize="small" style={{ color: "green", fontSize: 16 }} />
        );
      case "failed":
        return (
          <CloseIcon fontSize="small" style={{ color: "red", fontSize: 16 }} />
        );
      case "running":
        return (
          <AutorenewIcon
            fontSize="small"
            className={classes.animationSpinSlow}
            style={{ color: "#FFBA11", fontSize: 16 }}
          />
        );
      default:
        return null;
    }
  };

  const getStatusClass = (status: BuildStep["status"]) => {
    switch (status) {
      case "passed":
        return classes.passed;
      case "failed":
        return classes.failed;
      case "running":
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
          {getStatusIcon(step.status)}
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
