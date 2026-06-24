import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const promptsRoot = resolve(process.cwd(), "prompts");

export async function loadPrompt(relativePath: string): Promise<string> {
  const fullPath = resolve(promptsRoot, relativePath);

  if (!fullPath.startsWith(promptsRoot)) {
    throw new Error(`Prompt path escapes prompts directory: ${relativePath}`);
  }

  return readFile(fullPath, "utf8");
}

export function promptPath(relativePath: string): string {
  return join(promptsRoot, relativePath);
}
