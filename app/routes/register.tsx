import Register from "~/pages/login/Register";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reel Time App" },
    { name: "description", content: "Welcome to Reel Time!" },
  ];
}

export default function RegisterRoute() {
  return <Register />;
}
