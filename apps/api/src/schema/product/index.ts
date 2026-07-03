import { productSchema } from "@pricoteka/core/schema";
import * as z from "zod";

export const params = z.object({
  name: z.string().trim().min(1),
  description: z.string(),
  price: z.number(),
  found_in: z
    .array(
      z.object({
        store_id: z.string().uuid().optional(),
        office_id: z.string().uuid().optional(),
      }),
    )
    .optional(),
});

export const result = productSchema;
