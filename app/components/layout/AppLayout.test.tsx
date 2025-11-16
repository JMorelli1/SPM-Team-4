import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  RouterProvider,
  useParams,
  type RouteObject,
} from "react-router";
import AppLayout from "./AppLayout";
import { vi, describe, test, expect } from "vitest";

vi.mock("~/components/layout/Header/Header", () => ({
  default: () => <div data-testid="header-mock">MockHeader</div>,
}))

const Home = () => <div>Home Content</div>;
const Movie = () => {
  const { movieId } = useParams();
  return (
    <div>
      Movie Content: <span data-testid="movie-id">{movieId}</span>
    </div>
  );
};
const Actor = () => {
  const { actorId } = useParams();
  return (
    <div>
      Actor Content: <span data-testid="actor-id">{actorId}</span>
    </div>
  );
};

function renderWithRouter(initialEntries: string[] = ["/"]) {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "movie/:movieId", element: <Movie /> },
        { path: "actor/:actorId", element: <Actor /> },
      ],
    },
  ];
  const router = createMemoryRouter(routes, { initialEntries });
  return render(<RouterProvider router={router} />);
}

describe("AppLayout", () => {
  test("renders layout wrapper and Header", () => {
    renderWithRouter(["/"]);
    expect(document.querySelector(".app")).toBeInTheDocument();
    expect(screen.getByTestId("header-mock")).toBeInTheDocument();
    expect(document.querySelector(".app-content")).toBeInTheDocument();
  });

  test("renders index route content at '/' via <Outlet />", () => {
    renderWithRouter(["/"]);
    expect(screen.getByText("Home Content")).toBeInTheDocument();
  });

  test("renders nested movie route with params", () => {
    renderWithRouter(["/movie/42"]);
    expect(screen.getByText("Movie Content:")).toBeInTheDocument();
    expect(screen.getByTestId("movie-id")).toHaveTextContent("42");
  });

  test("renders nested actor route with params", () => {
    renderWithRouter(["/actor/abc123"]);
    expect(screen.getByText("Actor Content:")).toBeInTheDocument();
    expect(screen.getByTestId("actor-id")).toHaveTextContent("abc123");
  });

  test("shows TMDB attribution and logo", () => {
    renderWithRouter(["/"]);
    expect(screen.getByText(/Powered by/i)).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "assets/tmdb-logi.svg");
    expect(img).toHaveAttribute("alt", "TMDB Logo");
  });
});
