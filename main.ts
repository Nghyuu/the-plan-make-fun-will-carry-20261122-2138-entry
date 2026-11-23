import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.txt");

if (!existsSync(src)) {
  throw new Error(`entry.txt not found next to main.ts: ${src}`);
}

const text = readFileSync(src, "utf8");
if (text.trim().length === 0) {
  throw new Error("entry.txt is empty or whitespace-only");
}

const srcBytes = statSync(src).size;

const codePoints = [...text].length;
if (codePoints > 280) {
  throw new Error(`entry.txt is ${codePoints} code points, over the 280 limit`);
}

mkdirSync(outDir, { recursive: true });
const dest = join(outDir, "entry.txt");
copyFileSync(src, dest);

const copied = readFileSync(dest, "utf8");
if (copied !== text) {
  throw new Error("copied entry.txt does not match the source byte-for-byte");
}
if (statSync(dest).size !== srcBytes) {
  throw new Error("copied entry.txt size does not match the source");
}

console.log(`copied ${statSync(src).size} bytes, ${codePoints} code points -> ${dest}`);
