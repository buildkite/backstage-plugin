import {
  formatDuration,
  calculateBuildDuration,
  isRunning,
  formatDate,
  getDateRangeFromPreset,
} from './date';

describe('formatDuration', () => {
  it('formats seconds correctly', () => {
    expect(formatDuration(30)).toBe('30s');
    expect(formatDuration(59)).toBe('59s');
  });

  it('formats minutes correctly', () => {
    expect(formatDuration(60)).toBe('1m');
    expect(formatDuration(90)).toBe('1m');
    expect(formatDuration(120)).toBe('2m');
    expect(formatDuration(3599)).toBe('59m');
  });

  it('formats hours correctly', () => {
    expect(formatDuration(3600)).toBe('1h');
    expect(formatDuration(7200)).toBe('2h');
    expect(formatDuration(3660)).toBe('1h 1m');
    expect(formatDuration(3720)).toBe('1h 2m');
    expect(formatDuration(7260)).toBe('2h 1m');
  });
});

describe('calculateBuildDuration', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns 0s if no dates provided', () => {
    expect(calculateBuildDuration(undefined, undefined, false)).toBe('0s');
  });

  it('calculates duration for completed builds', () => {
    const startedAt = '2024-01-01T11:30:00Z';
    const finishedAt = '2024-01-01T11:45:00Z';
    expect(calculateBuildDuration(startedAt, finishedAt, false)).toBe('15m');
  });

  it('calculates duration for running builds', () => {
    const startedAt = '2024-01-01T11:30:00Z';
    expect(calculateBuildDuration(startedAt, undefined, true)).toBe('30m');
  });

  it('ignores finishedAt for running builds', () => {
    const startedAt = '2024-01-01T11:30:00Z';
    const finishedAt = '2024-01-01T11:45:00Z'; // Should be ignored for running builds
    expect(calculateBuildDuration(startedAt, finishedAt, true)).toBe('30m');
  });
});

describe('isRunning', () => {
  it('returns true for "running" state', () => {
    expect(isRunning('running')).toBe(true);
    expect(isRunning('RUNNING')).toBe(true);
    expect(isRunning('Running')).toBe(true);
  });

  it('returns false for other states', () => {
    expect(isRunning('failed')).toBe(false);
    expect(isRunning('passed')).toBe(false);
    expect(isRunning('canceled')).toBe(false);
  });

  it('handles undefined/null gracefully', () => {
    expect(isRunning(undefined as unknown as string)).toBe(false);
    expect(isRunning(null as unknown as string)).toBe(false);
  });
});

describe('formatDate', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-05-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('formats today correctly in local time', () => {
    const today = new Date('2024-05-15T10:30:00Z').toISOString();
    expect(formatDate(today, false)).toContain('Created today at');
  });

  it('formats yesterday correctly in local time', () => {
    const yesterday = new Date('2024-05-14T10:30:00Z').toISOString();
    expect(formatDate(yesterday, false)).toContain('Created yesterday at');
  });

  it('formats this week correctly in local time', () => {
    const threeDaysAgo = new Date('2024-05-12T10:30:00Z').toISOString();
    const result = formatDate(threeDaysAgo, false);
    expect(result).toMatch(/Created \w+ at/);
  });

  it('formats older dates correctly in local time', () => {
    const twoWeeksAgo = new Date('2024-05-01T10:30:00Z').toISOString();
    const result = formatDate(twoWeeksAgo, false);
    expect(result).toMatch(/Created \w+ 1st May at/);
  });

  it('formats dates correctly in UTC', () => {
    const date = new Date('2024-05-10T10:30:00Z').toISOString();
    const result = formatDate(date, true);
    expect(result).toContain('UTC');
  });

  it('includes trigger type when provided', () => {
    const date = new Date('2024-05-15T10:30:00Z').toISOString();
    const result = formatDate(date, false, 'Webhook');
    expect(result).toContain('triggered from Webhook');
  });
});

describe('getDateRangeFromPreset', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-05-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns correct range for "today"', () => {
    const { startDate, endDate } = getDateRangeFromPreset('today');
    expect(startDate.toISOString()).toBe('2024-05-15T00:00:00.000Z');
    expect(endDate.toISOString()).toBe('2024-05-15T12:00:00.000Z');
  });

  it('returns correct range for "yesterday"', () => {
    const { startDate, endDate } = getDateRangeFromPreset('yesterday');
    expect(startDate.toISOString()).toBe('2024-05-14T00:00:00.000Z');
    expect(endDate.toISOString()).toBe('2024-05-15T12:00:00.000Z');
  });

  it('returns correct range for "last7Days"', () => {
    const { startDate, endDate } = getDateRangeFromPreset('last7Days');
    const sevenDaysAgo = new Date('2024-05-08T12:00:00.000Z');
    expect(startDate.toISOString()).toBe(sevenDaysAgo.toISOString());
    expect(endDate.toISOString()).toBe('2024-05-15T12:00:00.000Z');
  });

  it('returns correct range for "last30Days"', () => {
    const { startDate, endDate } = getDateRangeFromPreset('last30Days');
    const thirtyDaysAgo = new Date('2024-04-15T12:00:00.000Z');
    expect(startDate.toISOString()).toBe(thirtyDaysAgo.toISOString());
    expect(endDate.toISOString()).toBe('2024-05-15T12:00:00.000Z');
  });

  it('defaults to last7Days for unknown presets', () => {
    const { startDate, endDate } = getDateRangeFromPreset('unknown');
    const sevenDaysAgo = new Date('2024-05-08T12:00:00.000Z');
    expect(startDate.toISOString()).toBe(sevenDaysAgo.toISOString());
    expect(endDate.toISOString()).toBe('2024-05-15T12:00:00.000Z');
  });
});
