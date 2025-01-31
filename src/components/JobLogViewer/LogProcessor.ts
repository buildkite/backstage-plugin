// logProcessor.ts

interface ProcessedLogLine {
  content: string;
  type: 'command' | 'output' | 'info' | 'warning' | 'error' | 'success';
  timestamp?: string;
}

type IntermediateLogLine = ProcessedLogLine | null;

function cleanAnsiCodes(text: string): string {
  // Remove terminal control sequences
  const controlSequences = [
    // ANSI escape sequences
    /\[\d+[A-Za-z]/g,
    /\[\d+;\d+[A-Za-z]/g,
    /\[\?25[hl]/g,
    /\[(\d+[A-Z]|\?25[hl]|\d+;\d+[A-Z])/g,
    // Color codes
    /\[\d+m/g,
    /\[38;\d;\d+m/g,
    /\[32m/g,
    /\[34m/g,
    /\[0m/g,
    /\[90m/g,
    // Terminal positioning
    /\[1A/g,
    /\[1B/g,
    /\[0G/g,
    // Cursor visibility
    /\[(\?25[hl])/g,
  ];

  let cleaned = text;
  controlSequences.forEach(sequence => {
    cleaned = cleaned.replace(sequence, '');
  });

  // Remove any remaining invisible characters
  cleaned = cleaned.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  );

  return cleaned;
}

export function processLogs(rawLogs: string[]): ProcessedLogLine[] {
  return rawLogs
    .map((line): IntermediateLogLine => {
      // Remove buildkite timestamp prefix and clean ANSI codes
      let cleanLine = line.replace(/_bk;t=\d+/, '').trim();

      cleanLine = cleanAnsiCodes(cleanLine);
      cleanLine = cleanLine.trim();

      if (!cleanLine) return null;

      // Extract timestamp if present
      let timestamp: string | undefined;
      const timestampMatch = cleanLine.match(
        /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
      );
      if (timestampMatch) {
        timestamp = timestampMatch[0];
        cleanLine = cleanLine.replace(timestampMatch[0], '').trim();
      }

      // Clean up specific patterns
      cleanLine = cleanLine
        .replace(/^\$\s+/, '') // Remove leading $ from commands
        .replace(/^~~~ /, '') // Remove leading ~~~ from section headers
        .replace(/\s+$/, ''); // Remove trailing whitespace

      if (!cleanLine) return null;

      // Identify line type and clean up content
      if (line.includes('$')) {
        return {
          content: cleanLine,
          type: 'command',
          timestamp,
        };
      } else if (cleanLine.includes('Warning:') || cleanLine.includes('⚠️')) {
        return {
          content: cleanLine.replace('⚠️', '').trim(),
          type: 'warning',
          timestamp,
        };
      } else if (cleanLine.toLowerCase().includes('error')) {
        return {
          content: cleanLine,
          type: 'error',
          timestamp,
        };
      } else if (
        cleanLine.includes('✔') ||
        cleanLine.includes('Successfully') ||
        cleanLine.includes('Removed')
      ) {
        return {
          content: cleanLine,
          type: 'success',
          timestamp,
        };
      } else if (
        line.includes('~~~') ||
        cleanLine.startsWith('Running') ||
        cleanLine.includes('Cleaning up')
      ) {
        return {
          content: cleanLine,
          type: 'info',
          timestamp,
        };
      } else {
        return {
          content: cleanLine,
          type: 'output',
          timestamp,
        };
      }
    })
    .filter(
      (line): line is ProcessedLogLine =>
        line !== null && line.content.trim() !== '',
    );
}
