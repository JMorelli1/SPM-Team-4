import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ActorCard from "./ActorCard";

// Mock navigation
const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const mod = await importOriginal<any>();
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  };
});

describe("ActorCard Component", () => {
  const mockActor = {
    id: 999,
    name: "Sample Actor",
    profile_path: "/actor.jpg",
  } as any;

  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("renders the actor name and profile image", () => {
    render(<ActorCard movie={mockActor} />);

    expect(screen.getByText("Sample Actor")).toBeInTheDocument();

    const img = screen.getByRole("img", { name: "Sample Actor" });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toContain("https://image.tmdb.org/t/p/w200");
  });

  it("navigates to the actor page when clicked", () => {
    render(<ActorCard movie={mockActor} />);

    const card = screen.getByTestId("actor-card");
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/actor/999");
  });
});
