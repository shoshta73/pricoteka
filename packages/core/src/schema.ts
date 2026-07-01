import * as z from "zod";

export const storeOfficeSchemaV1 = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export const storeSchemaV1 = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export const storeSchemaV2 = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  offices: z.array(storeOfficeSchemaV1),
});

export const storeSchema = storeSchemaV2;
export const storeOfficeSchema = storeOfficeSchemaV1;
