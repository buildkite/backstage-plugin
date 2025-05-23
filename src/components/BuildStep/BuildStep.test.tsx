import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BuildStep } from './BuildStep';
import { BuildStepParams } from '..';

describe.skip('BuildStep Component', () => {
  const stepPassed: BuildStepParams = {
    id: 'step1',
    status: 'PASSED',
    icon: 'https://example.com/icon.png',
    title: 'Step Passed',
    url: '#',
  };

  const stepFailed: BuildStepParams = {
    id: 'step2',
    status: 'FAILED',
    icon: 'https://example.com/icon.png',
    title: 'Step Failed',
    url: '#',
  };

  const stepRunning: BuildStepParams = {
    id: 'step3',
    status: 'RUNNING',
    icon: 'https://example.com/icon.png',
    title: 'Step Running',
    url: '#',
  };

  test('renders passed step correctly', () => {
    render(<BuildStep step={stepPassed} buildNumber="123" />);
    expect(screen.getByText('Step Passed')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', stepPassed.icon);
    expect(screen.getByRole('img')).toHaveAttribute('alt', stepPassed.title);
    expect(screen.getByTestId('DoneIcon')).toBeInTheDocument();
  });

  test('renders failed step correctly', () => {
    render(<BuildStep step={stepFailed} buildNumber="123" />);
    expect(screen.getByText('Step Failed')).toBeInTheDocument();
    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
  });

  test('renders running step correctly', () => {
    render(<BuildStep step={stepRunning} buildNumber="123" />);
    expect(screen.getByText('Step Running')).toBeInTheDocument();
    expect(screen.getByTestId('AutorenewIcon')).toBeInTheDocument();
  });

  test('handles click event', () => {
    console.info = jest.fn();
    render(<BuildStep step={stepPassed} buildNumber="123" />);
    fireEvent.click(screen.getByRole('button'));
    expect(console.info).toHaveBeenCalledWith('You clicked the Chip.');
  });
});
