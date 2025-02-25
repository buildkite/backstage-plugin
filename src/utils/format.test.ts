import {
  truncateString,
  formatCommitId,
  capitalizeFirstLetter,
  formatStatusForDisplay,
  getFallbackAvatarUrl,
  formatCount,
} from './format';

describe('truncateString', () => {
  it('truncates strings longer than the specified length', () => {
    expect(truncateString('This is a long string', 10)).toBe('This is a...');
  });

  it('does not truncate strings shorter than the specified length', () => {
    expect(truncateString('Short', 10)).toBe('Short');
  });

  it('does not truncate strings equal to the specified length', () => {
    expect(truncateString('Ten chars.', 10)).toBe('Ten chars.');
  });

  it('handles empty strings', () => {
    expect(truncateString('', 10)).toBe('');
  });

  it('handles null and undefined gracefully', () => {
    expect(truncateString(null as unknown as string, 10)).toBe(null);
    expect(truncateString(undefined as unknown as string, 10)).toBe(undefined);
  });
});

describe('formatCommitId', () => {
  it('formats commit IDs to the default length of 7', () => {
    expect(formatCommitId('abcdef1234567890')).toBe('abcdef1');
  });

  it('formats commit IDs to a specified length', () => {
    expect(formatCommitId('abcdef1234567890', 4)).toBe('abcd');
  });

  it('handles commit IDs shorter than the specified length', () => {
    expect(formatCommitId('abc', 7)).toBe('abc');
  });

  it('handles empty strings', () => {
    expect(formatCommitId('')).toBe('');
  });

  it('handles null and undefined gracefully', () => {
    expect(formatCommitId(null as unknown as string)).toBe('');
    expect(formatCommitId(undefined as unknown as string)).toBe('');
  });
});

describe('capitalizeFirstLetter', () => {
  it('capitalizes the first letter of a string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });

  it('converts rest of string to lowercase', () => {
    expect(capitalizeFirstLetter('hELLO')).toBe('Hello');
  });

  it('handles single-character strings', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
  });

  it('handles empty strings', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('handles null and undefined gracefully', () => {
    expect(capitalizeFirstLetter(null as unknown as string)).toBe(null);
    expect(capitalizeFirstLetter(undefined as unknown as string)).toBe(
      undefined,
    );
  });
});

describe('formatStatusForDisplay', () => {
  it('formats status strings for display', () => {
    expect(formatStatusForDisplay('RUNNING')).toBe('Running');
    expect(formatStatusForDisplay('failed')).toBe('Failed');
    expect(formatStatusForDisplay('NOT_RUN')).toBe('Not run');
  });

  it('handles empty strings', () => {
    expect(formatStatusForDisplay('')).toBe('');
  });

  it('handles null and undefined gracefully', () => {
    expect(formatStatusForDisplay(null as unknown as string)).toBe('');
    expect(formatStatusForDisplay(undefined as unknown as string)).toBe('');
  });
});

describe('getFallbackAvatarUrl', () => {
  it('returns a valid avatar URL based on a name', () => {
    const url = getFallbackAvatarUrl('John Doe');
    expect(url).toContain('https://api.dicebear.com/7.x/initials/svg');
    expect(url).toContain('seed=John%20Doe');
  });

  it('handles special characters in names', () => {
    const url = getFallbackAvatarUrl('Jörg Müller');
    expect(url).toContain('seed=J%C3%B6rg%20M%C3%BCller');
  });
});

describe('formatCount', () => {
  it('formats singular counts correctly', () => {
    expect(formatCount(1, 'build')).toBe('1 build');
    expect(formatCount(1, 'item')).toBe('1 item');
  });

  it('formats plural counts correctly', () => {
    expect(formatCount(0, 'build')).toBe('0 builds');
    expect(formatCount(2, 'build')).toBe('2 builds');
    expect(formatCount(5, 'item')).toBe('5 items');
  });
});
