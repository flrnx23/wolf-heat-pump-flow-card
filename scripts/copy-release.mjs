import { copyFile } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";

const source = fileURLToPath(new URL("../dist/wolf-heat-pump-flow-card.js", import.meta.url));
const sourceMap = fileURLToPath(
  new URL("../dist/wolf-heat-pump-flow-card.js.map", import.meta.url),
);
const target = fileURLToPath(new URL("../wolf-heat-pump-flow-card.js", import.meta.url));
const targetMap = fileURLToPath(new URL("../wolf-heat-pump-flow-card.js.map", import.meta.url));

await Promise.all([copyFile(source, target), copyFile(sourceMap, targetMap)]);
