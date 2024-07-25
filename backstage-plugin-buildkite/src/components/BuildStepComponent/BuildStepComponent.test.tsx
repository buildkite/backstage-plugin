import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BuildStep, { BuildStep as BuildStepType } from "./BuildStepComponent";

describe("BuildStep Component", () => {
  const stepPassed: BuildStepType = {
    id: "step1",
    status: "passed",
    icon: "https://example.com/icon.png",
    title: "Step Passed",
    url: "#",
  };

  const stepFailed: BuildStepType = {
    id: "step2",
    status: "failed",
    icon: "https://example.com/icon.png",
    title: "Step Failed",
    url: "#",
  };

  const stepRunning: BuildStepType = {
    id: "step3",
    status: "running",
    icon: "https://example.com/icon.png",
    title: "Step Running",
    url: "#",
  };

  test("renders passed step correctly", () => {
    render(<BuildStep step={stepPassed} />);
    expect(screen.getByText("Step Passed")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", stepPassed.icon);
    expect(screen.getByRole("img")).toHaveAttribute("alt", stepPassed.title);
    expect(screen.getByTestId("DoneIcon")).toBeInTheDocument();
  });

  test("renders failed step correctly", () => {
    render(<BuildStep step={stepFailed} />);
    expect(screen.getByText("Step Failed")).toBeInTheDocument();
    expect(screen.getByTestId("CloseIcon")).toBeInTheDocument();
  });

  test("renders running step correctly", () => {
    render(<BuildStep step={stepRunning} />);
    expect(screen.getByText("Step Running")).toBeInTheDocument();
    expect(screen.getByTestId("AutorenewIcon")).toBeInTheDocument();
  });

  test("handles click event", () => {
    console.info = jest.fn();
    render(<BuildStep step={stepPassed} />);
    fireEvent.click(screen.getByRole("button"));
    expect(console.info).toHaveBeenCalledWith("You clicked the Chip.");
  });
});