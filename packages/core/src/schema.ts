import * as z from "zod";

export const storeOfficeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  price: z.number(),
  found_in: z.array(
    z.object({
      store_id: z.string().uuid().optional(),
      office_id: z.string().uuid(),
    }),
  ),
});

export const storeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  offices: z.array(storeOfficeSchema),
});
