import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/*/index.ts"],
  format: "esm",
  treeshake: "smallest",
  dts: true,
  tsconfig: "tsconfig.build.json",
  clean: true,
});
