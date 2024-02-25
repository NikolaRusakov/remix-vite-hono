import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: { outDir: "./app/build" },
  preview: {
    port: 8081,
  },
  plugins: [remix({ ignoredRouteFiles: ["**/*.css"] }), tsconfigPaths()],
});
