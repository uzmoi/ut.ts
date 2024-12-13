import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/*/index.ts"],
  treeshake: "smallest",
  dts: true,
  tsconfig: "tsconfig.build.json",
  clean: true,
});
