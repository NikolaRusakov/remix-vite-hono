import { Hono } from "hono";
import { remix } from "remix-hono/handler";
import { serve } from "@hono/node-server";

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
app.use("*", remix({ build, mode: process.env.NODE_ENV }));

serve(app, (info) => {
  console.log("lols");
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
