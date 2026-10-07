import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const serverEnv = (globalThis as typeof globalThis & { process: { env: Record<string, string | undefined> } }).process.env;
  for (const [key, value] of Object.entries(loadEnv(mode, ".", ""))) {
    if (serverEnv[key] === undefined) serverEnv[key] = value;
  }
  return {
    plugins: [
      react(),
      {
        name: "talatrack-local-api",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const requestUrl = (req as typeof req & { url?: string }).url;
            if (!requestUrl?.startsWith("/api/")) return next();
            void import("./server/api.mjs")
              .then(({ handleRequest }) => handleRequest(req, res))
              .catch((error: unknown) => {
                console.error("Could not initialize TalaTrack's local API.");
                if (res.headersSent) return next(error);
                res.writeHead(503, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
                res.end(JSON.stringify({ error: "Local API unavailable. Check DATABASE_URL in .env." }));
              });
          });
        },
      },
    ],
  };
});
