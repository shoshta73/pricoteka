import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stores")({
  component: Stores,
});

function Stores() {
  return <div className="p-2 text-3xl font-bold underline">Stores</div>;
}
