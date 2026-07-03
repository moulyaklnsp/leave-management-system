import { swaggerSpec } from "../src/swagger/swagger.js";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../../docs/openapi.json");

writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2), "utf-8");
console.log("✅ openapi.json exported to docs/openapi.json");
