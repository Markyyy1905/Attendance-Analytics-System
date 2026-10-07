import { handleRequest } from "../server/api.mjs";

/**
 * Vercel's SPA fallback can otherwise rewrite API requests to index.html.
 * vercel.json routes /api/* here and carries the original path in __route.
 */
export default function handler(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const route = url.searchParams.get("__route");

  if (route !== null) {
    url.searchParams.delete("__route");
    request.url = `/api/${route.replace(/^\/+/, "")}${url.search}`;
  }

  return handleRequest(request, response);
}
