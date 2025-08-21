import {
  mapBuildkiteStatus,
  isSuccessStatus,
  isFailureStatus,
  isInProgressStatus,
  isClickableStatus,
  getStatusColors,
} from './status';
import { Status } from '../components';

describe('mapBuildkiteStatus', () => {
  it('maps common statuses correctly', () => {
    expect(mapBuildkiteStatus('passed')).toBe('PASSED');
    expect(mapBuildkiteStatus('failed')).toBe('FAILED');
    expect(mapBuildkiteStatus('running')).toBe('RUNNING');
    expect(mapBuildkiteStatus('scheduled')).toBe('SCHEDULED');
  });

  it('handles case insensitivity', () => {
    expect(mapBuildkiteStatus('PASSED')).toBe('PASSED');
    expect(mapBuildkiteStatus('Failed')).toBe('FAILED');
    expect(mapBuildkiteStatus('Running')).toBe('RUNNING');
  });

  it('maps specialized statuses correctly', () => {
    expect(mapBuildkiteStatus('canceling')).toBe('CANCELING');
    expect(mapBuildkiteStatus('blocked')).toBe('BLOCKED');
    expect(mapBuildkiteStatus('waiting')).toBe('WAITING');
  });

  it('returns Undetermined for unknown statuses', () => {
    expect(mapBuildkiteStatus('nonexistent_status')).toBe('Undetermined');
    expect(mapBuildkiteStatus('')).toBe('Undetermined');
  });

  it('handles undefined/null gracefully', () => {
    // Using type assertion to test edge cases
    expect(mapBuildkiteStatus(undefined as unknown as string)).toBe(
      'Undetermined',
    );
    expect(mapBuildkiteStatus(null as unknown as string)).toBe('Undetermined');
  });
});

describe('isSuccessStatus', () => {
  it('returns true for PASSED status', () => {
    expect(isSuccessStatus('PASSED')).toBe(true);
  });

  it('returns false for non-success statuses', () => {
    expect(isSuccessStatus('FAILED')).toBe(false);
    expect(isSuccessStatus('RUNNING')).toBe(false);
    expect(isSuccessStatus('CANCELED')).toBe(false);
    expect(isSuccessStatus('WAITING')).toBe(false);
  });

  it('handles undefined/null gracefully', () => {
    expect(isSuccessStatus(undefined as unknown as Status)).toBe(false);
    expect(isSuccessStatus(null as unknown as Status)).toBe(false);
  });
});

describe('isFailureStatus', () => {
  it('returns true for failure statuses', () => {
    expect(isFailureStatus('FAILED')).toBe(true);
    expect(isFailureStatus('FAILING')).toBe(true);
    expect(isFailureStatus('CANCELED')).toBe(true);
    expect(isFailureStatus('CANCELING')).toBe(true);
    expect(isFailureStatus('TIMING_OUT')).toBe(true);
  });

  it('returns false for non-failure statuses', () => {
    expect(isFailureStatus('PASSED')).toBe(false);
    expect(isFailureStatus('RUNNING')).toBe(false);
    expect(isFailureStatus('WAITING')).toBe(false);
  });

  it('handles undefined/null gracefully', () => {
    expect(isFailureStatus(undefined as unknown as Status)).toBe(false);
    expect(isFailureStatus(null as unknown as Status)).toBe(false);
  });
});

describe('isInProgressStatus', () => {
  it('returns true for in-progress statuses', () => {
    expect(isInProgressStatus('RUNNING')).toBe(true);
    expect(isInProgressStatus('CREATING')).toBe(true);
    expect(isInProgressStatus('SCHEDULED')).toBe(true);
    expect(isInProgressStatus('WAITING')).toBe(true);
    expect(isInProgressStatus('ASSIGNED')).toBe(true);
  });

  it('returns false for completed statuses', () => {
    expect(isInProgressStatus('PASSED')).toBe(false);
    expect(isInProgressStatus('FAILED')).toBe(false);
    expect(isInProgressStatus('CANCELED')).toBe(false);
  });

  it('handles undefined/null gracefully', () => {
    expect(isInProgressStatus(undefined as unknown as Status)).toBe(false);
    expect(isInProgressStatus(null as unknown as Status)).toBe(false);
  });
});

describe('isClickableStatus', () => {
  it('returns true for statuses that can show logs', () => {
    expect(isClickableStatus('PASSED')).toBe(true);
    expect(isClickableStatus('FAILED')).toBe(true);
    expect(isClickableStatus('CANCELED')).toBe(true);
  });

  it('returns false for statuses that cannot show logs', () => {
    expect(isClickableStatus('RUNNING')).toBe(false);
    expect(isClickableStatus('SCHEDULED')).toBe(false);
    expect(isClickableStatus('WAITING')).toBe(false);
    expect(isClickableStatus('BLOCKED')).toBe(false);
  });

  it('handles undefined/null gracefully', () => {
    expect(isClickableStatus(undefined as unknown as Status)).toBe(false);
    expect(isClickableStatus(null as unknown as Status)).toBe(false);
  });
});

describe('getStatusColors', () => {
  it('returns success colors for passed status', () => {
    const colors = getStatusColors('PASSED');
    expect(colors.main).toBe('#00BE13');
    expect(colors.subtle).toBe('#FBFDFA');
  });

  it('returns failure colors for failed status', () => {
    const colors = getStatusColors('FAILED');
    expect(colors.main).toBe('#F83F23');
    expect(colors.subtle).toBe('#FDF5F5');
  });

  it('returns failure colors for failing status', () => {
    const colors = getStatusColors('FAILING');
    expect(colors.main).toBe('#F83F23');
    expect(colors.subtle).toBe('#FDF5F5');
  });

  it('returns in-progress colors for running status', () => {
    const colors = getStatusColors('RUNNING');
    expect(colors.main).toBe('#FFBA11');
    expect(colors.subtle).toBe('#FEF8E9');
  });

  it('returns default colors for other statuses', () => {
    const colors = getStatusColors('BLOCKED');
    expect(colors.main).toBe('#888888');
    expect(colors.subtle).toBe('#FFFFFF');
  });

  it('handles undefined/null gracefully', () => {
    const colorsUndefined = getStatusColors(undefined as unknown as Status);
    expect(colorsUndefined.main).toBe('#888888');
    expect(colorsUndefined.subtle).toBe('#FFFFFF');

    const colorsNull = getStatusColors(null as unknown as Status);
    expect(colorsNull.main).toBe('#888888');
    expect(colorsNull.subtle).toBe('#FFFFFF');
  });
});
