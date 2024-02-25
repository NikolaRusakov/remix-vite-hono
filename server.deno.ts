import { Hono } from "https://deno.land/x/hono/mod.ts";

const app = new Hono();

import * as build from "./build/server/index.js";
import { remix } from "npm:remix-hono/handler";

// installGlobals();

app.use("*", remix({ build, mode: process.env.NODE_ENV }));
Deno.serve(app.fetch);
