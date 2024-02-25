import { Hono } from "hono";
import { remix } from "remix-hono/handler";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

if (process.env.NODE_ENV === "production")
  app.route("/", (await import("./server.routes.js")).default);

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: {
            middlewareMode: true,
            // middlewareMode: { server: app },
            // appType: "custom"
          },
        })
      );
const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
  : await import("./build/server/index.js");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.

  app.get(
    "/assets/*",
    serveStatic({
      root: "./build/client/assets",
    })
    // cache({
    //   cacheName: "client-build-assets",
    //   cacheControl: "max-age=1y",
    // })
  );
  // app.use(
  //   "/*",
  //   serveStatic({ root: "./build/client" })
  //   // cache({
  //   //   cacheName: "client-build",
  //   //   cacheControl: "max-age=1h",
  //   // })
  // );
}
app.use("/*", serveStatic({ root: "./build/client" }));

app.use("*", remix({ build, mode: process.env.NODE_ENV }));

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});

export default app;
