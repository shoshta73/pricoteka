import { createFileRoute } from "@tanstack/react-router";

import { useStoresStore } from "@/stores/storesStore";

export const Route = createFileRoute("/stores/$storeId")({
  component: StoreDetail,
});

function StoreDetail() {
  const { storeId } = Route.useParams();
  const store = useStoresStore((state) => state.stores.find((item) => item.id === storeId));

  if (!store) {
    return <div className="p-2">Store not found.</div>;
  }

  return <div className="p-2 text-3xl font-bold underline">{store.name}</div>;
}
