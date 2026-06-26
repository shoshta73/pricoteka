import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stores/create")({
  component: CreateStore,
});

function CreateStore() {
  return <div className="p-2 text-3xl font-bold underline">Create Store</div>;
}
