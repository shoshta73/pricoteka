import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { formatGeneratedFile, validateMessages } from "./i18n-utils.js";

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const sourcePath = resolve(rootDirectory, "data/locale/messages.json");
const outputPath = resolve(rootDirectory, "src/lib/i18n.generated.ts");

const source = await readFile(sourcePath, "utf8");
const messages = validateMessages(JSON.parse(source));

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, formatGeneratedFile(messages));
