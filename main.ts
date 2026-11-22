import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const src = join(process.cwd(), "entry.txt");
if (!existsSync(src)) {
  throw new Error("entry.txt not found");
}
const size = statSync(src).size;
if (size === 0) {
  throw new Error("entry.txt is empty");
}
const text = readFileSync(src, "utf8");
const codePoints = [...text].length;
if (codePoints > 280) {
  throw new Error(`entry.txt is ${codePoints} code points, over the 280 limit`);
}

mkdirSync(outDir, { recursive: true });
const dest = join(outDir, "entry.txt");
copyFileSync(src, dest);

// Verify the copy byte-for-byte before reporting success.
const copied = readFileSync(dest);
const original = readFileSync(src);
if (!copied.equals(original)) {
  throw new Error("copied entry.txt does not match the source");
}
console.log(`Copied entry.txt (${size} bytes, ${codePoints} code points) to ${outDir}, verified identical`);
