import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourcePath = join(dirname(fileURLToPath(import.meta.url)), "entry.txt");

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

if (!existsSync(sourcePath)) {
  throw new Error(`entry.txt not found next to main.ts: ${sourcePath}`);
}

const text = readFileSync(sourcePath, "utf8");
if (text.length === 0) {
  throw new Error("entry.txt is empty");
}
if ([...text].length > 280) {
  throw new Error(`entry.txt is ${[...text].length} code points, over the 280 limit`);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
copyFileSync(sourcePath, outPath);

const copied = readFileSync(outPath);
const original = readFileSync(sourcePath);
if (!copied.equals(original)) {
  throw new Error("copied entry.txt does not match the source byte-for-byte");
}

const copiedText = copied.toString("utf8");
if ([...copiedText].length !== [...text].length) {
  throw new Error(
    `output code-point count ${[...copiedText].length} does not match source ${[...text].length}`
  );
}
if (statSync(outPath).size !== copied.length) {
  throw new Error("output file size does not match the bytes copied");
}

console.log(`copied ${copied.length} bytes, ${[...text].length} code points -> ${outPath}`);
