import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Header from "./Header";
import { AppProvider } from "~/AppContextProvider";

// Mock useNavigate from react-router
const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
    const mod = await importOriginal<any>();
    return {
        ...mod,
        useNavigate: () => mockNavigate,
    };
});

// Mock the movie hook to control banner data.
const mockUseMovieBannerDiscover = vi.fn();
vi.mock("~/hooks/MovieHooks", () => ({
    useMovieBannerDiscover: () => mockUseMovieBannerDiscover(),
}));

const mockUseUserDetails = vi.fn();
vi.mock("~/hooks/UserHooks", () => ({
    useUserDetails: () => mockUseUserDetails(),
}));


// Test data
const imageBase = "https://image.tmdb.org/t/p/w500/";
const results = [
    { id: 101, title: "Movie One", backdrop_path: "one.jpg" },
    { id: 202, title: "Movie Two", backdrop_path: "two.jpg" },
    { id: 303, title: "Movie Three", backdrop_path: "three.jpg" },
];

describe("Header", () => {
    let containerObj = {};
    beforeEach(() => {
        vi.useFakeTimers();
        mockNavigate.mockReset();
        mockUseMovieBannerDiscover.mockReturnValue({
            data: { results },
            isLoading: false,
            isError: false,
        });

        mockUseUserDetails.mockReturnValue({
            data: { username: "testuser", favorites: [] },
            isLoading: false,
            isError: false,
        });

        containerObj = render(<AppProvider><Header /></AppProvider>);
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it("renders logo text and toolbar", () => {
        expect(screen.getByText("Reel Time")).toBeInTheDocument();
        expect(document.querySelector(".header_content__toolbar")).toBeInTheDocument();
    });

    it("initializes current banner layer with the first movie image and title", () => {
        const { container } = containerObj as { container: HTMLElement };

        // Current banner-layer should have CSS var set to first image
        const currentLayer = container.querySelector(".banner-layer.current") as HTMLElement;
        expect(currentLayer).toBeInTheDocument();
        expect(currentLayer.getAttribute("style")).toContain(`url(${imageBase}${results[0].backdrop_path})`);

        // Title layer shows the first title
        const titleLayer = container.querySelector(".title-layer") as HTMLElement;
        expect(titleLayer).toBeInTheDocument();
        expect(within(titleLayer).getByText(results[0].title)).toBeInTheDocument();
    });

    it("navigates to '/' when clicking the logo", () => {
        const logo = document.querySelector(".header_content__logo") as HTMLElement;
        fireEvent.click(logo);
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("navigates to the current movie page when clicking the title", () => {
        fireEvent.click(screen.getByText(results[0].title));
        expect(mockNavigate).toHaveBeenCalledWith(`/movie/${results[0].id}`);
    });

    it("should render next banner image after 20 secs", async () => {
        const { container } = containerObj as { container: HTMLElement };

        // Advance to trigger cycle
        await act(async () => {
            vi.advanceTimersByTime(20000);
        });

        // Next banner appears with the second movie image
        const nextLayer = container.querySelector(".banner-layer.next") as HTMLElement;
        expect(nextLayer).toBeInTheDocument();
        expect(nextLayer.getAttribute("style")).toContain(`url(${imageBase}${results[1].backdrop_path})`);

        const titleLayers = container.querySelectorAll(".title-layer");

        // We expect two title layers during the transition
        expect(titleLayers.length).toBeGreaterThanOrEqual(2);
        const classes = Array.from(titleLayers).map((el) => el.className);
        expect(classes.some((c) => c.includes("exit"))).toBe(true);
        expect(classes.some((c) => c.includes("enter"))).toBe(true);

        // The new title text should be present
        expect(screen.getByText(results[1].title)).toBeInTheDocument();
    });

    it("should swap next and current banner after 21 secs", async () => {
        const { container } = containerObj as { container: HTMLElement };

        // Trigger cycle
        await act(async () => {
            vi.advanceTimersByTime(21000);
        });

        // The 'next' image layer should be gone (setNextImage(null))
        const maybeNext = container.querySelector(".banner-layer.next");
        expect(maybeNext).toBeNull();

        // Current layer should now be the second movie image
        const currentLayer = container.querySelector(".banner-layer.current") as HTMLElement;
        expect(currentLayer.getAttribute("style")).toContain(`url(${imageBase}${results[1].backdrop_path})`);

        // Title click now navigates to the second movie id
        const currentTitleEl = screen.getAllByText(results[1].title)[0];
        fireEvent.click(currentTitleEl);
        expect(mockNavigate).toHaveBeenCalledWith(`/movie/${results[1].id}`);
    });

    it("should render third movie banner after 40 seconds", async () => {
        const { container } = containerObj as { container: HTMLElement };

        // First cycle to second movie
        await act(async () => {
            vi.advanceTimersByTime(21000);
        });

        // Second cycle to third movie
        await act(async () => {
            vi.advanceTimersByTime(20000);
        });

        const nextLayer = container.querySelector(".banner-layer.next") as HTMLElement;
        expect(nextLayer).toBeInTheDocument();
        expect(nextLayer.getAttribute("style")).toContain(`url(${imageBase}${results[2].backdrop_path})`);

        // Complete animation and verify current swaps to third
        await act(async () => {
            vi.advanceTimersByTime(1000);
        });

        const currentLayer = container.querySelector(".banner-layer.current") as HTMLElement;
        expect(currentLayer.getAttribute("style")).toContain(`url(${imageBase}${results[2].backdrop_path})`);
    });
});
