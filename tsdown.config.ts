import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/*/index.ts"],
  dts: true,
  tsconfig: "tsconfig.build.json",
});
