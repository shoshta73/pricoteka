export const storesQueryKeys = {
  all: ["stores"] as const,
  offices: (storeId: string) => [...storesQueryKeys.all, storeId, "offices"] as const,
};
