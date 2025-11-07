import type { Route } from "./+types/home";
import ActorDescription from "~/pages/actor_description/ActorDescription";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reel Time App" },
    { name: "description", content: "Welcome to Reel Time!" },
  ];
}

export default function ActorDescriptionRoute({ params }: { params: { actorId: string }}) {
  return <ActorDescription actorId={params.actorId} />;
}
