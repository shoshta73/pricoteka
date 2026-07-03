import * as z from "zod";

import { result as productResult } from "../product/index";

export const result = z.array(productResult);
