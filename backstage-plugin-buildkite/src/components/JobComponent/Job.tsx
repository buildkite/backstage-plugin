import React from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { BuildStepParams } from "../Types";
import { StatusIcon } from "../Icons";

interface JobProps {
  step: BuildStepParams;
}

const useStyles = makeStyles({
  job: {
    color: "#111111",
    borderRadius: "4px",
    margin: 0,
    minWidth: 0,
    border: "1px solid",
    borderColor: "#c2cace",
    backgroundColor: "transparent",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
  statusIcons: {
    display: "flex",
    gridGap: "4px",
    alignItems: "center",
    width: "fit-content",
    minWidth: "fit-content",
  },
  passed: {
    borderColor: "#c2cace",
  },
  running: {
    borderColor: "#FFBA11",
    boxShadow: "inset 4px 0 0 0 #FFBA11",
  },
  fail_soft: {
    borderColor: "#f83f23",
    backgroundColor: "#fdf5f5",
    boxShadow: "inset 4px 0 0 0 #f83f23",
  },
  fail: {
    borderColor: "#f83f23",
    backgroundColor: "#fdf5f5",
    boxShadow: "inset 4px 0 0 0 #f83f23",
  },
  unblocked: {
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  wait: {
    width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
    borderColor: "transparent",
    "& svg": {
      transform: "rotate(90deg)",
    },
    cursor: "default",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  blocked: {
    width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
  },
  assigned: {
    borderStyle: "dashed",
  },
  accepted: {
    borderStyle: "dotted",
  },
  skipped: {
    textDecoration: "line-through",
  },
  statusText: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 400,
    textTransform: "lowercase",
    color: "#444444",
    "&:first-letter": {
      textTransform: "uppercase",
    },
  },
});

export const Job: React.FC<JobProps> = ({ step }) => {
  const classes = useStyles();

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
      case "ASSIGNED":
        return classes.assigned;
      case "ACCEPTED":
        return classes.accepted;
      case "UNBLOCKED":
      case "BLOCKED":
        return classes.blocked;
      case "WAIT":
      case "WAITER":
        return classes.wait;
      case "SKIPPED":
        return classes.skipped;
      default:
        return "";
    }
  };
  return (
    <>
      {step.title ? (
        <Box
          key={step.id}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gridGap="8px"
          paddingX="10px"
          paddingY="14px"
          className={`${classes.job} ${getStatusClass(step.status)}`}
        >
          <Box className={classes.statusIcons}>
            <StatusIcon status={step.status} size="small" />
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
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gridGap="8px"
          >
            <Typography
              variant="h6"
              style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}
            >
              {step.title}
            </Typography>
            {step.status !== "BLOCKED" && step.status !== "UNBLOCKED" && (
              <Typography
                variant="h6"
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 500,
                  fontFamily: "monospace",
                }}
              >
                {step.command}
              </Typography>
            )}
          </Box>
          {step.status !== "BLOCKED" && step.status !== "UNBLOCKED" && (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              gridGap="8px"
              marginLeft="auto"
            >
              <Typography variant="h6" className={classes.statusText}>
                {step.status}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gridGap="8px"
          paddingX="10px"
          paddingY="14px"
          className={`${classes.job} ${getStatusClass(step.status)}`}
        >
          <StatusIcon status={step.status} size="small" />
        </Box>
      )}
    </>
  );
};
