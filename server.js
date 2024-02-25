import { Hono } from "hono";
import { remix } from "remix-hono/handler";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
  : await import("./build/server/index.js");

app.get("/api", (c) => c.text("Hono!"));
// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.

  app.get(
    "/assets/*",
    serveStatic({
      root: "./build/client/assets",
      // mimes: {
      //   m3u8: 'application/vnd.apple.mpegurl',
      //   ts: 'video/mp2t',
      // }
    })
  );
  // app.use(
  //   "/assets",
  //   express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  // );
}

app.use("/*", serveStatic({ root: "./build/client" }));

// app.use(express.static("build/client", { maxAge: "1h" }));

app.use("*", remix({ build, mode: process.env.NODE_ENV }));

serve(app, (info) => {
  console.log("lols");
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
