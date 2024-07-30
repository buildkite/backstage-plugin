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
  statusIcons: {
    display: "flex",
    gridGap: "4px",
    alignItems: "center",
    width: "fit-content",
    minWidth: "fit-content",
  },
  buildStep: {
    color: "#111111",
    borderRadius: "4px",
    margin: 0,
    minWidth: 0,
    borderColor: "#4f5d66",
    backgroundColor: "#f9fafb",
  },
  passed: {
    borderColor: "#00be141c",
    backgroundColor: "#f4f9f5",
    color: "#00522b",
  },
  running: {
    borderColor: "#FFBA11",
    backgroundColor: "#FFF8E7",
    color: "#111111",
  },
  fail_soft: {
    borderColor: "#f83f23",
    backgroundColor: "#fdf5f5",
  },
  fail: {
    borderColor: "#f83f23",
    boxShadow: "inset 0 0 0 2px #f83f23, inset 20px 0 0 0 #f83f23",
    backgroundColor: "#fdf5f5",
  },
  blocked: {
    borderColor: "#4b19d5",
    boxShadow: "inset 0 0 0 2px #4b19d5, inset -20px 0 0 0 #4b19d5",
    backgroundColor: "#FFF",
    paddingRight: "2px",
  },
  unblocked: {
    borderColor: "transparent",
    backgroundColor: "white",
  },
  assigned: {
    borderStyle: "dashed",
  },
  accepted: {
    borderStyle: "dotted",
  },
});

export const BuildStep: React.FC<BuildStepProps> = ({ step }) => {
  const classes = useStyles();
  const onDelete = () => {
    console.info("You clicked the Chip.");
  };

  const getStatusClass = (status: BuildStepParams["status"]) => {
    switch (status) {
      case "PASSED":
        return classes.passed;
      case "FAILED":
        return classes.fail;
      case "FAILING":
      case "CANCELING":
        return classes.fail_soft;
      case "RUNNING":
        return classes.running;
      case "BLOCKED":
        return classes.blocked;
      case "ASSIGNED":
        return classes.assigned;
      case "ACCEPTED":
        return classes.accepted;
      case "UNBLOCKED":
      case "WAIT":
      case "WAITER":
        return classes.unblocked;
      default:
        return "";
    }
  };

  return (
    <>
      {step.title ? (
        <Chip
          className={`${classes.buildStep} ${getStatusClass(step.status)}`}
          icon={
            <Box className={classes.statusIcons}>
              <StatusIcon
                status={step.status}
                size="small"
                color={step.status === "FAILED" ? "#ffffff" : undefined}
              />
              {Array.isArray(step.icon) && step.icon.length > 0 ? (
                step.icon.map((iconSrc, index) => (
                  <img
                    key={index}
                    height="16"
                    width="16"
                    src={iconSrc}
                    alt={step.title}
                    className="emoji"
                  />
                ))
              ) : step.icon ? (
                <img
                  height="16"
                  width="16"
                  src={step.icon}
                  alt={step.title}
                  className="emoji"
                />
              ) : null}
            </Box>
          }
          label={step.title}
          variant="outlined"
          size="small"
          {...(step.status === "BLOCKED" && {
            deleteIcon: (
              <StatusIcon status="CONTINUE" size="small" color="#FFFFFF" />
            ),
            onDelete: onDelete,
          })}
        />
      ) : (
        <StatusIcon status={step.status} size="small" />
      )}
    </>
  );
};

export default BuildStep;
