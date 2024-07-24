import React from "react";
import { SvgIcon, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
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
});

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
        stroke-width="1.5"
      />
      <path
        d="M17.715 7.71708C19.1351 7.71708 20.2864 6.56581 20.2864 5.14565C20.2864 3.72549 19.1351 2.57422 17.715 2.57422C16.2948 2.57422 15.1436 3.72549 15.1436 5.14565C15.1436 6.56581 16.2948 7.71708 17.715 7.71708Z"
        stroke="currentColor"
        fill="transparent"
        stroke-width="1.5"
      />
      <path
        d="M7.42885 21.43C8.84901 21.43 10.0003 20.2787 10.0003 18.8585C10.0003 17.4384 8.84901 16.2871 7.42885 16.2871C6.00869 16.2871 4.85742 17.4384 4.85742 18.8585C4.85742 20.2787 6.00869 21.43 7.42885 21.43Z"
        stroke="currentColor"
        fill="transparent"
        stroke-width="1.5"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.57129 6.85938H8.28557V12.4546C9.19545 11.6403 10.397 11.1451 11.7141 11.1451H15.1427C16.0895 11.1451 16.857 10.3776 16.857 9.4308V6.85938H18.5713V9.4308C18.5713 11.3244 17.0363 12.8594 15.1427 12.8594H13.4284H11.7141C9.8206 12.8594 8.28557 14.3944 8.28557 16.2879V17.1451H6.57129V16.2879V6.85938Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function BuildFailed(props: any) {
  return (
    <SvgIcon {...props}>
      <defs>
        <circle
          id="BuildState_725a436f-1036-4239-b22f-393bf208fcd1_circle"
          fill="#fff"
          cx="12"
          cy="12"
          r="11.25"
          stroke="#F83F23"
          strokeWidth="3"
        ></circle>
        <clipPath id="BuildState_725a436f-1036-4239-b22f-393bf208fcd1_strokeClipPath">
          <use href="#BuildState_725a436f-1036-4239-b22f-393bf208fcd1_circle"></use>
        </clipPath>
      </defs>
      <use
        href="#BuildState_725a436f-1036-4239-b22f-393bf208fcd1_circle"
        clipPath="url(#BuildState_725a436f-1036-4239-b22f-393bf208fcd1_strokeClipPath)"
      ></use>
      <g fill="none" stroke="#F83F23" strokeWidth="1.5">
        <path d="M9.34836 9.375L14.6517 14.6783" strokeLinecap="round"></path>
        <path d="M14.6516 9.375L9.34834 14.6783" strokeLinecap="round"></path>
      </g>
    </SvgIcon>
  );
}

export function BuildPassed(props: any) {
  return (
    <SvgIcon {...props}>
      <defs>
        <circle
          id="BuildState_a103a210-e910-4a11-8303-3daee470da6c_circle"
          fill="#fff"
          cx="12"
          cy="12"
          r="11.25"
          stroke="#00BE13"
          strokeWidth="3"
        ></circle>
        <clipPath id="BuildState_a103a210-e910-4a11-8303-3daee470da6c_strokeClipPath">
          <use href="#BuildState_a103a210-e910-4a11-8303-3daee470da6c_circle"></use>
        </clipPath>
      </defs>
      <use
        href="#BuildState_a103a210-e910-4a11-8303-3daee470da6c_circle"
        clipPath="url(#BuildState_a103a210-e910-4a11-8303-3daee470da6c_strokeClipPath)"
      ></use>
      <path
        d="M8.66268 12.75L10.9393 15.0267L15.7123 10.2537"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke="#00BE13"
        strokeWidth="1.5"
      ></path>
    </SvgIcon>
  );
}

export function BuildRunning(props: any) {
  const classes = useStyles();
  return (
    <SvgIcon {...props}>
      <defs>
        <circle
          id="BuildState_1901ddb4-d78b-4f5e-8759-b3ec01b81174_circle"
          fill="#fff"
          cx="12"
          cy="12"
          r="11.25"
          stroke="#FFBA11"
          stroke-width="3"
        ></circle>
        <clipPath id="BuildState_1901ddb4-d78b-4f5e-8759-b3ec01b81174_strokeClipPath">
          <use href="#BuildState_1901ddb4-d78b-4f5e-8759-b3ec01b81174_circle"></use>
        </clipPath>
      </defs>
      <use
        href="#BuildState_1901ddb4-d78b-4f5e-8759-b3ec01b81174_circle"
        clip-path="url(#BuildState_1901ddb4-d78b-4f5e-8759-b3ec01b81174_strokeClipPath)"
      ></use>
      <g
        fill="none"
        stroke="#FFBA11"
        stroke-width="1.5"
        className={classes.animationSpinSlow}
        style={{ transformOrigin: "center center" }}
      >
        <path
          d="M12 16.5C13.1935 16.5 14.3381 16.0259 15.182 15.182C16.0259 14.3381 16.5 13.1935 16.5 12"
          stroke-miterlimit="10"
          stroke-linecap="round"
        ></path>
        <path
          d="M11.5 7C10.3065 7 9.16193 7.47411 8.31802 8.31802C7.47411 9.16193 7 10.3065 7 11.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
        ></path>
      </g>
    </SvgIcon>
  );
}
