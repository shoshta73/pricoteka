import * as z from "zod";

import { result as storeResult } from "../store/index";

export const result = z.array(storeResult);
