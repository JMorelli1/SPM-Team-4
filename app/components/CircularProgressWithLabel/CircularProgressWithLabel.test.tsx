import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

describe("CircularProgressWithLabel Component", () => {
  it("renders the correct percentage text", () => {
    render(<CircularProgressWithLabel value={72} />);

    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("rounds decimal values correctly", () => {
    render(<CircularProgressWithLabel value={49.6} />);

    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});
