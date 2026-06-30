import * as z from "zod";

export const params = z.object({
  name: z.string().trim().min(1),
});
