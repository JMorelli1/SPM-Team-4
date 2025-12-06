import type { Route } from "./+types/home";
import Login from "../pages/login/Login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reel Time App" },
    { name: "description", content: "Welcome to Reel Time!" },
  ];
}

export default function LoginRoute() {
  return <Login />;
}
