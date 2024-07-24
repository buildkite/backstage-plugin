import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Chip,
  Tooltip,
  Link,
  IconButton,
  Collapse,
} from "@material-ui/core";
import { Progress, ResponseErrorPanel } from "@backstage/core-components";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import useAsync from "react-use/lib/useAsync";
import {
  BranchIcon,
  BuildFailed,
  BuildPassed,
  BuildRunning,
  GithubIcon,
} from "../Icons";

const useStyles = makeStyles({
  buildBox: {
    "&:not(:last-child)": {
      borderBottom: "1px solid #E5E5E5",
    },
  },
  navatar: {
    width: "24px",
    height: "24px",
    boxShadow: "0px 0px 0px 1px #00000011",
    backgroundColor: "#B5FFCE",
  },
  chip: {
    color: "#737373",
    border: "none",
    borderRadius: "4px",
    margin: 0,
  },
});

type Build = {
  statusIcon: React.ReactNode;
  buildMessage: string;
  buildNumber: string;
  author: {
    avatar: string;
    name: string;
  };
  branch: string;
  commitId: string;
  createdAt: string;
  timeElapsed: string;
};

type BuildBoxProps = {
  builds: Build[];
};

export const BuildBox = ({ builds }: BuildBoxProps) => {
  const classes = useStyles();
  const [isUTC, setIsUTC] = useState(false);
  const [expanded, setExpanded] = useState<boolean[]>(
    new Array(builds.length).fill(false)
  );

  const formatDate = (dateString: string, toUTC: boolean) => {
    const date = new Date(dateString);
    if (toUTC) {
      const day = date.toUTCString().slice(0, 3);
      const dayOfMonth = date.getUTCDate();
      const month = date.toUTCString().slice(8, 11);
      const year = date.getUTCFullYear();
      const time = date.toUTCString().slice(17, 22);
      return `Created ${day} ${dayOfMonth}th ${month} ${year} at ${time} UTC`;
    } else {
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const time = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return isToday
        ? `Created today at ${time}`
        : `Created on ${date.toLocaleDateString()} at ${time}`;
    }
  };

  const handleExpandClick = (index: number) => {
    setExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  const handleTimeClick = () => {
    setIsUTC(!isUTC);
  };

  return (
    <Paper variant="outlined" style={{ overflow: "hidden" }}>
      <Box
        display="flex"
        flexDirection="row"
        gridGap="8px"
        alignItems="center"
        bgcolor="#F8F8F8"
        borderBottom="1px solid #E5E5E5"
        padding="8px"
      >
        <Avatar variant="rounded" className={classes.navatar}>
          <img
            height="16"
            width="16"
            src="https://buildkiteassets.com/emojis/img-buildkite-64/buildkite.png"
          />
        </Avatar>
        <Typography
          variant="h5"
          style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}
        >
          ads-promo-client
        </Typography>
      </Box>
      {builds.map((build, index) => (
        <Box className={classes.buildBox} key={build.buildNumber}>
          <Box
            display="flex"
            padding="12px"
            gridGap="12px"
            className={classes.buildBox}
          >
            <Box
              display="flex"
              flexDirection="column"
              gridGap="6px"
              alignItems="center"
            >
              {build.statusIcon}
              <Typography
                variant="caption"
                style={{ color: "#737373", paddingTop: "1px" }}
              >
                {build.timeElapsed}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" gridGap="4px">
              <Box
                display="flex"
                paddingLeft="4px"
                gridGap="6px"
                alignItems="center"
              >
                <Link color="textPrimary" href="#">
                  <Typography variant="subtitle2">
                    <strong>{build.buildMessage}</strong>
                  </Typography>
                </Link>
                <Typography
                  variant="caption"
                  style={{ color: "#737373", paddingTop: "3px" }}
                >
                  #{build.buildNumber}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" margin={0} gridGap="3px">
                <Chip
                  className={classes.chip}
                  avatar={<Avatar src={build.author.avatar} />}
                  label={build.author.name}
                  variant="outlined"
                  size="small"
                  onClick={handleClick}
                />
                <Typography style={{ color: "#111111", fontSize: "12px" }}>
                  ·
                </Typography>
                <Chip
                  className={classes.chip}
                  style={{ paddingLeft: "4px" }}
                  icon={<BranchIcon size="small" />}
                  label={build.branch}
                  variant="outlined"
                  size="small"
                  onClick={handleClick}
                />
                <Typography variant="caption">/</Typography>
                <Chip
                  className={classes.chip}
                  style={{ paddingLeft: "4px" }}
                  icon={<GithubIcon viewBox="0 0 13 13" />}
                  label={build.commitId}
                  variant="outlined"
                  size="small"
                  onClick={handleClick}
                />
                <Typography style={{ color: "#111111", fontSize: "12px" }}>
                  ·
                </Typography>
                <Tooltip
                  title="Click to toggle between local and UTC"
                  placement="top"
                >
                  <Chip
                    className={classes.chip}
                    label={formatDate(build.createdAt, isUTC)}
                    variant="outlined"
                    size="small"
                    onClick={handleTimeClick}
                  />
                </Tooltip>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => handleExpandClick(index)}
              aria-expanded={expanded[index]}
              aria-label="show more"
              style={{ marginLeft: "auto", borderRadius: "4px" }}
            >
              <UnfoldMoreIcon fontSize="inherit" />
            </IconButton>
          </Box>
          <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
            <Box
              bgcolor="#f8f8f8"
              padding="12px"
              boxShadow="inset 0px 1px 4px rgba(0, 0, 0, 0.1)"
            >
              <Typography paragraph>
                Pipelines and annotations go here
              </Typography>
            </Box>
          </Collapse>
        </Box>
      ))}
    </Paper>
  );
};

export const PipelineFetchComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<Build[]> => {
    return [
      {
        statusIcon: <BuildFailed />,
        buildMessage: "Fix issue with user login",
        buildNumber: "123",
        author: {
          avatar: "https://api.dicebear.com/6.x/open-peeps/svg?seed=Author1",
          name: "Jane Doe",
        },
        branch: "main",
        commitId: "a1b2c3d4",
        createdAt: "2024-07-24T09:23:00Z",
        timeElapsed: "36s",
      },
      {
        statusIcon: <BuildRunning />,
        buildMessage: "Add transaction context to all queries",
        buildNumber: "124",
        author: {
          avatar: "https://api.dicebear.com/6.x/open-peeps/svg?seed=Author2",
          name: "John Smith",
        },
        branch: "feature/payments",
        commitId: "e5f6g7h8",
        createdAt: "2024-07-24T10:45:00Z",
        timeElapsed: "2m",
      },
      {
        statusIcon: <BuildPassed />,
        buildMessage: "Add new feature for payments",
        buildNumber: "125",
        author: {
          avatar: "https://api.dicebear.com/6.x/open-peeps/svg?seed=Author2",
          name: "John Smith",
        },
        branch: "feature/payments",
        commitId: "sdf8d10",
        createdAt: "2024-07-24T10:45:00Z",
        timeElapsed: "17m",
      },
    ];
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <BuildBox builds={value || []} />;
};
