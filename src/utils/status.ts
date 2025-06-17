import { Status } from '../components';

/**
 * Maps a Buildkite status string to our internal Status type.
 *
 * @param status - The status string from Buildkite API
 * @returns The mapped Status enum value
 */
export function mapBuildkiteStatus(status: string): Status {
  switch (status?.toLowerCase()) {
    case 'passed':
      return 'PASSED';
    case 'failed':
    case 'broken':
    case 'blocked_failed':
    case 'unblocked_failed':
      return 'FAILED';
    case 'running':
      return 'RUNNING';
    case 'scheduled':
      return 'SCHEDULED';
    case 'canceled':
      return 'CANCELED';
    case 'canceling':
      return 'CANCELING';
    case 'skipped':
      return 'SKIPPED';
    case 'not_run':
      return 'NOT_RUN';
    case 'waiting':
      return 'WAITING';
    case 'waiting_failed':
      return 'WAITING_FAILED';
    case 'blocked':
      return 'BLOCKED';
    case 'unblocked':
      return 'UNBLOCKED';
    case 'creating':
      return 'CREATING';
    case 'failing':
      return 'FAILING';
    case 'timing_out':
      return 'TIMING_OUT';
    case 'assigned':
      return 'ASSIGNED';
    case 'accepted':
      return 'ACCEPTED';
    case 'limited':
      return 'LIMITED';
    case 'limiting':
      return 'LIMITING';
    case 'paused':
      return 'PAUSED';
    case 'wait':
      return 'WAIT';
    case 'waiter':
      return 'WAITER';
    default:
      console.warn(`Unhandled Buildkite status: ${status}`);
      return 'Undetermined';
  }
}

/**
 * Determines if a build status represents a successful build.
 *
 * @param status - The Status to check
 * @returns True if the status represents success
 */
export function isSuccessStatus(status: Status): boolean {
  return status === 'PASSED';
}

/**
 * Determines if a build status represents a failed build.
 *
 * @param status - The Status to check
 * @returns True if the status represents failure
 */
export function isFailureStatus(status: Status): boolean {
  return ['FAILED', 'FAILING', 'CANCELED', 'CANCELING', 'TIMING_OUT'].includes(
    status,
  );
}

/**
 * Determines if a build status represents an in-progress build.
 *
 * @param status - The Status to check
 * @returns True if the status represents an in-progress state
 */
export function isInProgressStatus(status: Status): boolean {
  return ['RUNNING', 'CREATING', 'SCHEDULED', 'WAITING', 'ASSIGNED'].includes(
    status,
  );
}

/**
 * Determines if a build status represents a clickable state (can show logs).
 *
 * @param status - The Status to check
 * @returns True if the status represents a state that can show logs
 */
export function isClickableStatus(status: Status): boolean {
  return ['PASSED', 'FAILED', 'CANCELED'].includes(status);
}

/**
 * Gets color information for a build status.
 *
 * @param status - The Status to get colors for
 * @returns Object with main and subtle colors for the status
 */
export function getStatusColors(status: Status): {
  main: string;
  subtle: string;
} {
  const colorMap = {
    PASSED: { main: '#00BE13', subtle: '#FBFDFA' },
    FAILED: { main: '#F83F23', subtle: '#FDF5F5' },
    FAILING: { main: '#F83F23', subtle: '#FDF5F5' },
    RUNNING: { main: '#FFBA11', subtle: '#FEF8E9' },
    DEFAULT: { main: '#888888', subtle: '#FFFFFF' },
  };

  if (isSuccessStatus(status)) {
    return colorMap.PASSED;
  } else if (isFailureStatus(status)) {
    return colorMap.FAILED;
  } else if (isInProgressStatus(status)) {
    return colorMap.RUNNING;
  }

  return colorMap.DEFAULT;
}
