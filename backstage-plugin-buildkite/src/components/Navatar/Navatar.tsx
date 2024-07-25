import React from "react";
import { Avatar, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  navatar: {
    width: "24px",
    height: "24px",
    boxShadow: "0px 0px 0px 1px #00000011",
    backgroundColor: (props: any) => props.navatarColor,
  },
});

export const Navatar = ({ color, image }) => {
  const classes = useStyles({ navatarColor: color });

  return (
    <Avatar variant="rounded" className={classes.navatar}>
      <img height="16" width="16" src={image} alt="avatar" />
    </Avatar>
  );
};
