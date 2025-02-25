/**
 * Formats a duration in seconds to a human-readable string.
 *
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "36s", "5m", "2h 30m")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

/**
 * Calculates the duration of a build based on its start and finish times.
 *
 * @param startedAt - ISO timestamp when the build started
 * @param finishedAt - ISO timestamp when the build finished (null if still running)
 * @param isRunning - Flag indicating if the build is still running
 * @returns Formatted duration string
 */
export function calculateBuildDuration(
  startedAt: string | undefined,
  finishedAt: string | undefined,
  isRunning: boolean,
): string {
  if (isRunning && startedAt) {
    const started = new Date(startedAt);
    const now = new Date();
    return formatDuration(
      Math.floor((now.getTime() - started.getTime()) / 1000),
    );
  }

  if (startedAt && finishedAt) {
    const started = new Date(startedAt);
    const finished = new Date(finishedAt);
    return formatDuration(
      Math.floor((finished.getTime() - started.getTime()) / 1000),
    );
  }

  return '0s';
}

/**
 * Determines if a build is in running state based on its status.
 *
 * @param state - The build state/status string
 * @returns True if the build is currently running
 */
export function isRunning(state: string): boolean {
  return state?.toLowerCase() === 'running';
}

/**
 * Formats a date for display, with different formats based on how recent it is.
 *
 * @param dateString - ISO timestamp to format
 * @param toUTC - Whether to show the time in UTC
 * @param triggerType - Optional trigger type to append to the formatted date
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  toUTC: boolean,
  triggerType?: string,
): string {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const time = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  let formattedDate;
  if (toUTC) {
    const utcDay = date.toUTCString().slice(0, 3);
    const utcDayOfMonth = date.getUTCDate();
    const utcMonth = date.toUTCString().slice(8, 11);
    const utcYear = date.getUTCFullYear();
    const utcTime = date.toUTCString().slice(17, 22);
    formattedDate = `Created ${utcDay} ${utcDayOfMonth}${getOrdinalSuffix(utcDayOfMonth)} ${utcMonth} ${utcYear} at ${utcTime} UTC`;
  } else if (date.toDateString() === now.toDateString()) {
    formattedDate = `Created today at ${time}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    formattedDate = `Created yesterday at ${time}`;
  } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    formattedDate = `Created ${dayOfWeek} at ${time}`;
  } else {
    formattedDate = `Created ${dayOfWeek} ${day}${getOrdinalSuffix(day)} ${month} at ${time}`;
  }

  if (triggerType) {
    formattedDate += ` - triggered from ${triggerType}`;
  }

  return formattedDate;
}

/**
 * Gets the ordinal suffix for a number (1st, 2nd, 3rd, 4th, etc.).
 *
 * @param n - The number to get the suffix for
 * @returns The ordinal suffix ('st', 'nd', 'rd', or 'th')
 */
function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Creates a date range for filtering based on a preset option.
 *
 * @param preset - The preset option (today, yesterday, last7Days, last30Days)
 * @returns Object containing start and end dates for the range
 */
export function getDateRangeFromPreset(preset: string): {
  startDate: Date;
  endDate: Date;
} {
  const endDate = new Date();
  let startDate = new Date();

  switch (preset) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'last7Days':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'last30Days':
      startDate.setDate(startDate.getDate() - 30);
      break;
    default:
      // Default to last 7 days
      startDate.setDate(startDate.getDate() - 7);
      break;
  }

  return { startDate, endDate };
}
