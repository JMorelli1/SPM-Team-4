import type { Route } from "./+types/home";
import MovieDescription from "~/pages/movie_description/MovieDescription";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reel Time App" },
    { name: "description", content: "Welcome to Reel Time!" },
  ];
}

export default function MovieDescriptionRoute({ params }: Route.ComponentProps) {
  return <MovieDescription movieId={params.movieId} />;
}
