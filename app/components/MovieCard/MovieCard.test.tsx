import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MovieCard from "./MovieCard";

// Mock react-router (same style as Header.test.tsx)
const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const mod = await importOriginal<any>();
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  };
});

describe("MovieCard Component", () => {
  const mockMovie = {
    id: 101,
    title: "Test Movie",
    poster_path: "/poster.jpg",
  } as any;

  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("renders the movie title and poster", () => {
    render(<MovieCard movie={mockMovie} />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();

    const img = screen.getByRole("img", { name: "Test Movie" });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toContain("https://image.tmdb.org/t/p/w200");
  });

  it("navigates to the movie page when clicked", () => {
    render(<MovieCard movie={mockMovie} />);

    const card = screen.getByTestId("movie-card");
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/movie/101");
  });
});
