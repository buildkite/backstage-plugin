import React from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Status } from "../Types";

const useStyles = makeStyles({
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
  animationSpinSlow: {
    animation: "$spin 2s linear infinite",
  },
  "@keyframes tick": {
    "0%": { transform: "rotate(0deg)", transformOrigin: "center" },
    "100%": { transform: "rotate(360deg)", transformOrigin: "center" },
  },
  minuteHand: {
    animation: "$tick 12s steps(30) infinite",
  },
  hourHand: {
    animation: "$tick 144s linear infinite",
  },
});

type Size = "small" | "medium" | "large";
interface StatusIconProps {
  status: Status;
  size: Size;
}

const colors = {
  green: "#00BE13",
  red: "#F83F23",
  orange: "#FFBA11",
  gray: "#888888",
} as const;

type ColorValue = (typeof colors)[keyof typeof colors];

interface IconConfig {
  color: ColorValue;
  animate?: boolean;
  icons: Record<Size, React.FC<SvgIconProps>>;
}

const statusConfig: Record<Status, IconConfig> = {
  PASSED: {
    color: colors.green,
    icons: { small: PassedSmall, medium: PassedMedium, large: PassedLarge },
  },
  CREATING: {
    color: colors.orange,
    icons: { small: RunningSmall, medium: RunningMedium, large: RunningLarge },
    animate: true,
  },
  RUNNING: {
    color: colors.orange,
    icons: { small: RunningSmall, medium: RunningMedium, large: RunningLarge },
    animate: true,
  },
  FAILED: {
    color: colors.red,
    icons: { small: FailedSmall, medium: FailedMedium, large: FailedLarge },
  },
  FAILING: {
    color: colors.red,
    icons: { small: FailingSmall, medium: FailingMedium, large: FailingLarge },
    animate: true,
  },

  CANCELED: {
    color: colors.gray,
    icons: {
      small: CanceledSmall,
      medium: CanceledMedium,
      large: CanceledLarge,
    },
  },
  CANCELING: {
    color: colors.gray,
    icons: {
      small: CanceledSmall,
      medium: CanceledMedium,
      large: CanceledLarge,
    },
  },
  NOT_RUN: {
    color: colors.gray,
    icons: { small: SkippedSmall, medium: SkippedMedium, large: SkippedLarge },
  },
  PAUSED: {
    color: colors.gray,
    icons: { small: PausedSmall, medium: PausedMedium, large: PausedLarge },
  },
  UNBLOCKED: {
    color: colors.gray,
    icons: {
      small: UnblockedSmall,
      medium: UnblockedMedium,
      large: UnblockedLarge,
    },
  },
  BLOCKED: {
    color: colors.gray,
    icons: { small: BlockedSmall, medium: BlockedMedium, large: BlockedLarge },
  },
  CONTINUE: {
    color: colors.gray,
    icons: {
      small: ContinueSmall,
      medium: ContinueMedium,
      large: ContinueLarge,
    },
  },
  SCHEDULED: {
    color: colors.gray,
    icons: {
      small: ScheduledSmall,
      medium: ScheduledMedium,
      large: ScheduledLarge,
    },
  },
  SKIPPED: {
    color: colors.gray,
    icons: { small: SkippedSmall, medium: SkippedMedium, large: SkippedLarge },
  },
  WAITING: {
    color: colors.gray,
    icons: { small: WaitingSmall, medium: WaitingMedium, large: WaitingLarge },
    animate: true,
  },
  WAITING_FAILED: {
    color: colors.gray,
    icons: {
      small: ScheduledSmall,
      medium: ScheduledMedium,
      large: ScheduledLarge,
    },
  },
  Undetermined: {
    color: colors.gray,
    icons: {
      small: ScheduledSmall,
      medium: ScheduledMedium,
      large: ScheduledLarge,
    },
  },
};

export const StatusIcon: React.FC<StatusIconProps> = ({ status, size }) => {
  const classes = useStyles();
  const { color, animate, icons } = statusConfig[status];
  const IconComponent = icons[size];

  const fontSizeMap = {
    small: "16px",
    medium: "24px",
    large: "44px",
  };

  const isWaitingIcon = status === "WAITING";

  return (
    <IconComponent
      style={{ color, fontSize: fontSizeMap[size] }}
      className={
        isWaitingIcon
          ? `${classes.minuteHand} ${classes.hourHand}`
          : animate
          ? classes.animationSpinSlow
          : undefined
      }
    />
  );
};

export function PassedSmall(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <path
        d="M4 8.5L6.5 11L11.5 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </SvgIcon>
  );
}

export function PassedMedium(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 25 24" fontSize="inherit">
      <circle
        cx="12.25"
        cy="12"
        r="11.25"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8.5 12.5L11 15L16 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </SvgIcon>
  );
}

export function PassedLarge(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 45 44" fontSize="inherit">
      <rect x="0.25" width="44" height="44" rx="22" fill="currentColor" />
      <path
        d="M19.6719 27.7644C19.9844 28.0785 20.5156 28.0785 20.8281 27.7644L30.0156 18.5288C30.3281 18.2147 30.3281 17.6806 30.0156 17.3665L28.8906 16.2356C28.5781 15.9215 28.0781 15.9215 27.7656 16.2356L20.2656 23.7749L16.7344 20.2565C16.4219 19.9424 15.9219 19.9424 15.6094 20.2565L14.4844 21.3874C14.1719 21.7016 14.1719 22.2356 14.4844 22.5497L19.6719 27.7644Z"
        fill="white"
      />
    </SvgIcon>
  );
}

export function FailedSmall(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <path
        d="M11.75 5L5.75 11"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M5.75 5L11.75 11"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function FailedMedium(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 25 24" fontSize="inherit">
      <circle
        cx="12.75"
        cy="12"
        r="11.25"
        fill="white"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path
        d="M10.0984 9.375L15.4017 14.6783"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M15.4016 9.375L10.0983 14.6783"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function FailedLarge(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 45 44" fontSize="inherit">
      <path
        d="M1.40554 25.5327C2.05093 23.4822 2.37362 22.4569 2.37362 22C2.37362 21.543 2.05093 20.5178 1.40555 18.4672C-0.132007 13.5819 1.03524 8.02932 4.90729 4.15727C8.77935 0.285207 14.332 -0.882039 19.2172 0.655531C21.2678 1.30091 22.2931 1.62361 22.75 1.62361C23.2069 1.62361 24.2322 1.30092 26.2828 0.655538C31.168 -0.882021 36.7206 0.28523 40.5927 4.15728C44.4647 8.02934 45.632 13.5819 44.0944 18.4672C43.4491 20.5178 43.1264 21.543 43.1264 22C43.1264 22.4569 43.4491 23.4822 44.0945 25.5327C45.632 30.418 44.4648 35.9706 40.5927 39.8427C36.7207 43.7148 31.1681 44.882 26.2828 43.3445C24.2322 42.6991 23.2069 42.3764 22.75 42.3764C22.2931 42.3764 21.2678 42.6991 19.2172 43.3445C14.332 44.882 8.77933 43.7148 4.90727 39.8427C1.0352 35.9707 -0.132043 30.418 1.40554 25.5327Z"
        fill="currentColor"
      />
      <path
        d="M25.0138 21.983L28.4181 18.5787C28.8606 18.1702 28.8606 17.4894 28.4181 17.0809L27.6691 16.3319C27.2606 15.8894 26.5798 15.8894 26.1713 16.3319L22.767 19.7362L19.3287 16.3319C18.9202 15.8894 18.2394 15.8894 17.8309 16.3319L17.0819 17.0809C16.6394 17.4894 16.6394 18.1702 17.0819 18.5787L20.4862 21.983L17.0819 25.4213C16.6394 25.8298 16.6394 26.5106 17.0819 26.9191L17.8309 27.6681C18.2394 28.1106 18.9202 28.1106 19.3287 27.6681L22.767 24.2638L26.1713 27.6681C26.5798 28.1106 27.2606 28.1106 27.6691 27.6681L28.4181 26.9191C28.8606 26.5106 28.8606 25.8298 28.4181 25.4213L25.0138 21.983Z"
        fill="white"
      />
    </SvgIcon>
  );
}

export function FailingSmall(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <path
        d="M12.25 8C12.25 10.2091 10.4591 12 8.25 12M4.25 8C4.25 5.79086 6.04086 4 8.25 4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function FailingMedium(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 25 24" fontSize="inherit">
      <circle
        cx="12.25"
        cy="12"
        r="11.25"
        fill="white"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path
        d="M12.25 16.5C13.4435 16.5 14.5881 16.0259 15.432 15.182C16.2759 14.3381 16.75 13.1935 16.75 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
      <path
        d="M11.75 7C10.5565 7 9.41193 7.47411 8.56802 8.31802C7.72411 9.16193 7.25 10.3065 7.25 11.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function FailingLarge(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 45 44" fontSize="inherit">
      <rect x="0.25" width="44" height="44" rx="22" fill="currentColor" />
      <path
        d="M22.25 29C24.1065 29 25.887 28.2625 27.1997 26.9497C28.5125 25.637 29.25 23.8565 29.25 22"
        stroke="white"
        stroke-width="3"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
      <path
        d="M22.25 15C20.3935 15 18.613 15.7375 17.3003 17.0503C15.9875 18.363 15.25 20.1435 15.25 22"
        stroke="white"
        stroke-width="3"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function RunningSmall(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <path
        d="M12.25 8C12.25 10.2091 10.4591 12 8.25 12M4.25 8C4.25 5.79086 6.04086 4 8.25 4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function RunningMedium(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 25 24" fontSize="inherit">
      <circle
        cx="12.25"
        cy="12"
        r="11.25"
        fill="white"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path
        d="M12.25 16.5C13.4435 16.5 14.5881 16.0259 15.432 15.182C16.2759 14.3381 16.75 13.1935 16.75 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
      <path
        d="M11.75 7C10.5565 7 9.41193 7.47411 8.56802 8.31802C7.72411 9.16193 7.25 10.3065 7.25 11.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function RunningLarge(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 45 44" fontSize="inherit">
      <rect x="0.25" width="44" height="44" rx="22" fill="currentColor" />
      <path
        d="M22.25 29C24.1065 29 25.887 28.2625 27.1997 26.9497C28.5125 25.637 29.25 23.8565 29.25 22"
        stroke="white"
        stroke-width="3"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
      <path
        d="M22.25 15C20.3935 15 18.613 15.7375 17.3003 17.0503C15.9875 18.363 15.25 20.1435 15.25 22"
        stroke="white"
        stroke-width="3"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function WaitingSmall(props: SvgIconProps) {
  const classes = useStyles();

  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <circle
        cx="8"
        cy="8"
        r="6.25"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M8 8L8 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className={classes.minuteHand}
      />
      <path
        d="M8 8L8 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className={classes.hourHand}
      />
    </SvgIcon>
  );
}

export function WaitingMedium(props: SvgIconProps) {
  const classes = useStyles();

  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
      <circle
        cx="12"
        cy="12"
        r="9.25"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 12L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className={classes.minuteHand}
      />
      <path
        d="M12 12L12 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className={classes.hourHand}
      />
    </SvgIcon>
  );
}

export function WaitingLarge(props: SvgIconProps) {
  const classes = useStyles();

  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="inherit">
      <circle
        cx="16"
        cy="16"
        r="12.25"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M16 16L16 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className={classes.minuteHand}
      />
      <path
        d="M16 16L16 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className={classes.hourHand}
      />
    </SvgIcon>
  );
}

export function CanceledSmall(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <path
        d="M11.25 5L5.25 11"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function CanceledMedium(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
      <circle
        cx="12.25"
        cy="12"
        r="11.25"
        stroke="#C2CACE"
        stroke-width="1.5"
        fill="none"
      />
      <path
        d="M12.25 16.5C13.4435 16.5 14.5881 16.0259 15.432 15.182C16.2759 14.3381 16.75 13.1935 16.75 12"
        stroke="#C2CACE"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        fill="none"
      />
      <path
        d="M12.25 7.5C11.0565 7.5 9.91193 7.97411 9.06802 8.81802C8.22411 9.66193 7.75 10.8065 7.75 12"
        stroke="#C2CACE"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        fill="none"
      />
      <path
        d="M15.9624 8.28809L8.53778 15.7127"
        stroke="#C2CACE"
        stroke-width="1.5"
        stroke-linecap="round"
        fill="none"
      />
    </SvgIcon>
  );
}

export function CanceledLarge(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="inherit">
      <circle cx="22" cy="22" r="22" fill="currentColor" />
      <path
        d="M22.25 30C24.3717 30 26.4066 29.1571 27.9069 27.6569C29.4071 26.1566 30.25 24.1217 30.25 22"
        stroke="white"
        stroke-width="2.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        fill="none"
      />
      <path
        d="M22.25 14C20.1283 14 18.0934 14.8429 16.5931 16.3431C15.0929 17.8434 14.25 19.8783 14.25 22"
        stroke="white"
        stroke-width="2.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        fill="none"
      />
      <rect
        x="14.2952"
        y="28.1875"
        width="20"
        height="2.5"
        rx="1.25"
        transform="rotate(-45 14.2952 28.1875)"
        fill="white"
      />
    </SvgIcon>
  );
}

export function ScheduledSmall(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <circle
        cx="8.75"
        cy="8"
        r="6.25"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
      />
      <path
        d="M8.75 8.33301L10.75 9.99967"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        fill="none"
      />
      <path
        d="M8.75 5V8.33333"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        fill="none"
      />
    </SvgIcon>
  );
}

export function ScheduledMedium(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
      <circle
        cx="12.75"
        cy="12"
        r="11.25"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path
        d="M12.75 7.5V12.75L15.375 15.375"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function ScheduledLarge(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="inherit">
      <circle cx="23" cy="22" r="22" fill="currentColor" />
      <path
        d="M22.8214 17C23.4152 17 23.8929 17.4807 23.8929 18.0781V22.3053L25.683 24.1426C26.1384 24.5648 26.1384 25.2477 25.683 25.6295C25.3036 26.0877 24.625 26.0877 24.2054 25.6295L22.0625 23.4732C21.8616 23.3115 21.75 23.0375 21.75 22.75V18.0781C21.75 17.4807 22.2277 17 22.8214 17Z"
        fill="white"
      />
      <circle cx="22.75" cy="22" r="10" stroke="white" stroke-width="2" />
    </SvgIcon>
  );
}

export function SkippedSmall(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <path
        d="M11.25 8L5.25 8"
        stroke="#888888"
        stroke-width="2"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function SkippedMedium(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
      <circle
        cx="12.25"
        cy="12"
        r="11.25"
        stroke="#C2CACE"
        stroke-width="1.5"
      />
      <path
        d="M9.25 12H15.25"
        stroke="#C2CACE"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function SkippedLarge(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="inherit">
      <circle cx="23" cy="22" r="22" fill="#C2CACE" />
      <rect x="16.25" y="21" width="12" height="3" rx="1.5" fill="white" />
    </SvgIcon>
  );
}

export function BlockedSmall(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <path
        d="M6.25 4L10.75 8L6.25 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </SvgIcon>
  );
}

export function BlockedMedium(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
      <path
        d="M10.25 8L14.75 12L10.25 16"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </SvgIcon>
  );
}

export function BlockedLarge(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="inherit">
      <circle cx="22" cy="22" r="22" fill="white" />
      <path
        d="M20.25 18L24.75 22L20.25 26"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
}

export function UnblockedSmall(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <path
        d="M6.25 4L10.75 8L6.25 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </SvgIcon>
  );
}

export function UnblockedMedium(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
      <path
        d="M10.25 8L14.75 12L10.25 16"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </SvgIcon>
  );
}

export function UnblockedLarge(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="inherit">
      <circle cx="22" cy="22" r="22" fill="white" />
      <path
        d="M20.25 18L24.75 22L20.25 26"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
}

export function PausedSmall(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <path
        d="M6.75 5V11"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M10.75 5V11"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function PausedMedium(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
      <circle
        cx="12.75"
        cy="12"
        r="11.25"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path
        d="M10.875 15L10.875 9"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M14.625 15L14.625 9"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </SvgIcon>
  );
}

export function PausedLarge(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="inherit">
      <rect x="0.75" width="44" height="44" rx="22" fill="currentColor" />
      <circle cx="24" cy="22" r="22" fill="currentColor" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.75 17.5C20.75 16.6716 20.0784 16 19.25 16C18.4216 16 17.75 16.6716 17.75 17.5V26.5C17.75 27.3284 18.4216 28 19.25 28C20.0784 28 20.75 27.3284 20.75 26.5L20.75 17.5ZM27.75 17.5C27.75 16.6716 27.0784 16 26.25 16C25.4216 16 24.75 16.6716 24.75 17.5L24.75 26.5C24.75 27.3284 25.4216 28 26.25 28C27.0784 28 27.75 27.3284 27.75 26.5V17.5Z"
        fill="white"
      />
    </SvgIcon>
  );
}

export function ContinueSmall(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fontSize="inherit">
      <path
        d="M4.75 8H8.25H12.75M9.25 4.5L12.75 8M9.25 11.5L12.75 8"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
}

export function ContinueMedium(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit">
      <path
        d="M8.75 12H12.25H16.75M13.25 8.5L16.75 12M13.25 15.5L16.75 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
}

export function ContinueLarge(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="inherit">
      <circle cx="23" cy="22" r="22" fill="white" />
      <path
        d="M18.75 22H22.25H26.75M23.25 18.5L26.75 22M23.25 25.5L26.75 22"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
}

// Other icons

export function GithubIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path
        d="M6.3641 0C4.65549 0.0218071 3.02543 0.721097 1.83217 1.94419C0.638913 3.16728 -0.0199218 4.8141 0.000459165 6.52273C-0.01159 7.88167 0.401532 9.21037 1.18201 10.3229C1.96249 11.4354 3.07127 12.2761 4.35319 12.7273C4.40261 12.7448 4.45552 12.75 4.50742 12.7426C4.55931 12.7351 4.60863 12.7153 4.65116 12.6846C4.69369 12.654 4.72816 12.6135 4.75163 12.5666C4.77509 12.5197 4.78686 12.4679 4.78591 12.4155C4.78591 12.2627 4.78591 11.8491 4.78591 11.3082C3.01682 11.7027 2.64137 10.4364 2.64137 10.4364C2.52451 10.0333 2.2642 9.68702 1.90955 9.46273C1.33046 9.05545 1.9541 9.06818 1.9541 9.06818C2.15996 9.09522 2.35676 9.16963 2.52901 9.28557C2.70126 9.40151 2.84428 9.55581 2.94682 9.73636C3.03008 9.8962 3.1448 10.0376 3.28409 10.1519C3.42339 10.2663 3.58437 10.3513 3.75736 10.4018C3.93035 10.4523 4.11178 10.4673 4.29073 10.4459C4.46967 10.4245 4.64244 10.3672 4.79864 10.2773C4.82594 9.94865 4.96784 9.64007 5.19955 9.40545C3.81864 9.24636 2.3041 8.68636 2.3041 6.18545C2.29765 5.54668 2.53161 4.92883 2.95955 4.45455C2.76612 3.8917 2.7888 3.27706 3.02319 2.73C3.02319 2.73 3.55773 2.54545 4.77319 3.37273C5.81368 3.08064 6.91451 3.08064 7.955 3.37273C9.17046 2.54545 9.705 2.70455 9.705 2.70455C9.94596 3.25902 9.96869 3.88403 9.76864 4.45455C10.1942 4.93657 10.4215 5.56178 10.405 6.20455C10.405 8.71182 8.91591 9.26545 7.49682 9.42455C7.64967 9.58449 7.76718 9.77479 7.84173 9.98309C7.91628 10.1914 7.9462 10.413 7.92955 10.6336C7.92955 11.5055 7.92955 12.2118 7.92955 12.4218C7.92656 12.4755 7.93723 12.5291 7.96057 12.5776C7.98391 12.626 8.01915 12.6678 8.06301 12.6989C8.10687 12.7301 8.15791 12.7496 8.21136 12.7557C8.2648 12.7617 8.31892 12.7542 8.36864 12.7336C9.65278 12.2832 10.7637 11.442 11.5454 10.3281C12.3272 9.21422 12.7407 7.88352 12.7277 6.52273C12.7481 4.8141 12.0893 3.16728 10.896 1.94419C9.70276 0.721097 8.07271 0.0218071 6.3641 0Z"
        fill="black"
      />
    </SvgIcon>
  );
}

export function BranchIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path
        d="M7.42885 7.71708C8.84901 7.71708 10.0003 6.56581 10.0003 5.14565C10.0003 3.72549 8.84901 2.57422 7.42885 2.57422C6.00869 2.57422 4.85742 3.72549 4.85742 5.14565C4.85742 6.56581 6.00869 7.71708 7.42885 7.71708Z"
        stroke="currentColor"
        fill="transparent"
        strokeWidth="1.5"
      />
      <path
        d="M17.715 7.71708C19.1351 7.71708 20.2864 6.56581 20.2864 5.14565C20.2864 3.72549 19.1351 2.57422 17.715 2.57422C16.2948 2.57422 15.1436 3.72549 15.1436 5.14565C15.1436 6.56581 16.2948 7.71708 17.715 7.71708Z"
        stroke="currentColor"
        fill="transparent"
        strokeWidth="1.5"
      />
      <path
        d="M7.42885 21.43C8.84901 21.43 10.0003 20.2787 10.0003 18.8585C10.0003 17.4384 8.84901 16.2871 7.42885 16.2871C6.00869 16.2871 4.85742 17.4384 4.85742 18.8585C4.85742 20.2787 6.00869 21.43 7.42885 21.43Z"
        stroke="currentColor"
        fill="transparent"
        strokeWidth="1.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.57129 6.85938H8.28557V12.4546C9.19545 11.6403 10.397 11.1451 11.7141 11.1451H15.1427C16.0895 11.1451 16.857 10.3776 16.857 9.4308V6.85938H18.5713V9.4308C18.5713 11.3244 17.0363 12.8594 15.1427 12.8594H13.4284H11.7141C9.8206 12.8594 8.28557 14.3944 8.28557 16.2879V17.1451H6.57129V16.2879V6.85938Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}
