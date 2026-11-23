import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const entryPath = join(dirname(fileURLToPath(import.meta.url)), "entry.txt");
if (!existsSync(entryPath)) {
  throw new Error(`entry.txt not found at ${entryPath}`);
}

const entry = readFileSync(entryPath, "utf8");
if (entry.trim().length === 0) {
  throw new Error("entry.txt is empty");
}
const codePoints = [...entry].length;
if (codePoints > 280) {
  throw new Error(`entry.txt is ${codePoints} code points, over the 280 limit`);
}

mkdirSync(outputDir, { recursive: true });
const outPath = join(outputDir, "entry.txt");
copyFileSync(entryPath, outPath);

const copied = readFileSync(outPath);
const original = readFileSync(entryPath);
if (copied.length !== original.length) {
  throw new Error(`output size ${copied.length} bytes != source size ${original.length} bytes`);
}
if (!copied.equals(original)) {
  throw new Error("output entry.txt is not byte-identical to source");
}
const outCodePoints = [...copied.toString("utf8")].length;
if (outCodePoints !== codePoints) {
  throw new Error(`output code points ${outCodePoints} != source ${codePoints}`);
}

console.log(`copied ${copied.length} bytes (${codePoints} code points) to ${outPath}`);
console.log(`verified output: ${copied.length} bytes, ${outCodePoints} code points, byte-identical`);
