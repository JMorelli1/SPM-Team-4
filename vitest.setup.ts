import "@testing-library/jest-dom/vitest"
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Ensure the DOM is reset after every test
afterEach(() => {
  cleanup();
});