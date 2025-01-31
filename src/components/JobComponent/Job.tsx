import React, { useState } from 'react';
import { BuildStepParams } from '../Types';
import { JobLogViewer } from '../JobLogViewer';

interface JobProps {
  step: BuildStepParams;
  onFetchLogs: () => Promise<{ content: string[] }>;
  buildNumber: string;
  renderStep: (props: { onClick: () => void }) => React.ReactNode;
}

export const Job: React.FC<JobProps> = ({ step, onFetchLogs, renderStep }) => {
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<Error | undefined>();

  const isClickable = (status: BuildStepParams['status']) => {
    return ['PASSED', 'FAILED', 'CANCELED'].includes(status);
  };

  const handleClick = async () => {
    if (step.title && isClickable(step.status)) {
      setLogViewerOpen(true);
      setLoading(true);
      setError(undefined);

      try {
        const logData = await onFetchLogs();
        setLogs(logData.content);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch logs'),
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {renderStep({ onClick: handleClick })}

      <JobLogViewer
        open={logViewerOpen}
        onClose={() => setLogViewerOpen(false)}
        jobId={step.id}
        jobUrl={step.url || ''}
        status={step.status}
        title={step.title || ''}
        logs={logs}
        loading={loading}
        error={error}
      />
    </>
  );
};
