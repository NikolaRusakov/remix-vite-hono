import { vitePlugin as remix } from "@remix-run/dev";
import { Connect, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";
import { ProxyOptions, ViteDevServer } from "vite";
import { getRequestListener } from "@hono/node-server";
import type http from "http";

import { Fetch } from "node_modules/@hono/vite-dev-server/dist/types";
import app from "./server.routes";
// const app = express();
// app.get("/api", (req, res) => {
//   res.send("Hello world!").end();
// });

// const ap = new Hono();
// ap.get("/api", (c) => c.text("Hono!"));

const proxy: Record<string, string | ProxyOptions> = {
  "/api": {}, // proxy our /api route to nowhere
};
function honoApiPlugin() {
  return {
    name: "hono-plugin",
    config() {
      return {
        server: { proxy },
        preview: { proxy },
      };
    },
    async configureServer(server: ViteDevServer) {
      async function createMiddleware(
        server: ViteDevServer
      ): Promise<Connect.HandleFunction> {
        return async function (
          req: http.IncomingMessage,
          res: http.ServerResponse,
          next: Connect.NextFunction
        ): Promise<void> {
          if (!req.url?.includes("/api")) return next();
          getRequestListener(async (request) => {
            const response = await app.fetch(request, {} as { fetch: Fetch });
            return response;
          })(req, res);
        };
      }
      server.middlewares.use(await createMiddleware(server));
    },
  };
}
export default defineConfig({
  preview: {
    port: 8000,
  },
  plugins: [
    remix({ ignoredRouteFiles: ["**/*.css"] }),
    tsconfigPaths(),
    visualizer({ emitFile: true }),
    honoApiPlugin(),
  ],
});
