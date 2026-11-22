import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.txt");
if (!existsSync(src) || statSync(src).size === 0) {
  console.error(`error: ${src} is missing or empty; nothing to copy`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, "entry.txt"));
console.error(`copied ${statSync(src).size} bytes to ${join(outDir, "entry.txt")}`);
