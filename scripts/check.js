import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const blocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
if (!blocks.length) throw new Error("Nenhum bloco JavaScript foi encontrado em index.html.");

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "survival-island-check-"));
try {
  for (let i = 0; i < blocks.length; i++) {
    const attrs = blocks[i][1] || "";
    const source = blocks[i][2] || "";
    if (!source.trim()) continue;
    const isModule = /\btype\s*=\s*["']module["']/i.test(attrs);
    const file = path.join(temp, \`script-\${i}.\${isModule ? "mjs" : "js"}\`);
    fs.writeFileSync(file, source);
    const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (result.status !== 0) {
      process.stderr.write(result.stderr || result.stdout || \`Falha ao verificar script \${i}.\n\`);
      process.exitCode = 1;
      break;
    }
  }
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
if (!process.exitCode) console.log("JavaScript syntax check passed.");
