/**
 * Truncates a string to a maximum length and adds an ellipsis if needed.
 *
 * @param str - The string to truncate
 * @param maxLength - The maximum length allowed
 * @returns The truncated string with ellipsis if needed
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) {
    return str;
  }
  return `${str.substring(0, maxLength).trim()}...`;
}

/**
 * Formats a commit ID to a shorter displayable version.
 *
 * @param commitId - The full commit ID
 * @param length - The desired length (default: 7)
 * @returns The shortened commit ID
 */
export function formatCommitId(commitId: string, length = 7): string {
  if (!commitId) {
    return '';
  }
  return commitId.substring(0, length);
}

/**
 * Capitallizes the first letter of a string.
 *
 * @param str - The string to capitalize
 * @returns The string with first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formats a status string for display.
 *
 * @param status - The status string
 * @returns The formatted status string
 */
export function formatStatusForDisplay(status: string): string {
  if (!status) {
    return '';
  }

  return capitalizeFirstLetter(status.replace(/_/g, ' '));
}

/**
 * Creates a fallback avatar URL based on a username.
 *
 * @param name - The user's name
 * @returns A URL to a generated avatar
 */
export function getFallbackAvatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
}

/**
 * Formats a count with appropriate suffix (for build counts, etc.).
 *
 * @param count - The count number
 * @param label - The label to use (singular form)
 * @returns Formatted string with count and pluralized label
 */
export function formatCount(count: number, label: string): string {
  return `${count} ${label}${count !== 1 ? 's' : ''}`;
}
