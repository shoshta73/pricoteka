import { storeOfficeSchema, storeSchema } from "@pricoteka/core/schema";
import * as z from "zod";

export const params = z.object({
  name: z.string().trim().min(1),
});

export const officePathParams = z.object({
  id: z.string().uuid(),
});

export const officeParams = z.object({
  name: z.string().trim().min(1),
});

export const result = storeSchema;
export const officeResult = storeOfficeSchema;
