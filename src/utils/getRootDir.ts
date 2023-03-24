/**
 * REFERENCES:
 * - https://sabe.io/blog/node-check-file-exists-async-await
 * - https://stackoverflow.com/a/30942572
 */

import { stat } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Determines whether filePath exists or not
 * @param filePath Path of a file
 * @returns boolean
 */
async function fileExists(filePath: string) {
  return !!(await stat(filePath).catch(e => false));
}

/**
 * Find the project's root directory
 * @returns Root Application Directory Path (same as location of "package.json" file)
 */
export async function getRootDir() {
  // Get the directory path of this file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  let currentDir = __dirname;

  // Keep moving up directories until you find the package.json file (package.json file is always in root directory)
  while (!(await fileExists(path.join(currentDir, "package.json")))) {
    currentDir = path.join(currentDir, "..");
  }
  return currentDir;
}
