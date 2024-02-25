import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  preview: {
    port: 8000,
  },
  plugins: [
    remix({ ignoredRouteFiles: ["**/*.css"] }),
    tsconfigPaths(),
    visualizer({ emitFile: true }),
  ],
});
