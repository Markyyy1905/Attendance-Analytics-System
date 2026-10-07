import { handleRequest } from "../server/api.mjs";

export default function handler(request, response) {
  return handleRequest(request, response);
}