import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Poster from "./Poster";

describe("Poster Component", () => {
  it("renders TMDB image when a valid path is provided", () => {
    render(<Poster path="/test.jpg" altText="Test Poster" width={200} />);

    const img = screen.getByRole("img", { name: "Test Poster" });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toContain("https://image.tmdb.org/t/p/w200");
  });

  it("renders fallback image when no path is provided", () => {
    render(<Poster path={null} altText="No Image Found" width={200} />);

    const img = screen.getByRole("img", { name: "No Image Found" });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBeTruthy();
  });
});
