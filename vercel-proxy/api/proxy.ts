import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Simple proxy for GET/POST with CORS.
 * Edits the upstream URL and injects a secret (kept on Vercel).
 *
 * ENV VARS (set in Vercel dashboard):
 *  - BASE_URL   e.g. https://api.themoviedb.org/3
 *  - API_KEY    (optional) secret token to append as a query param
 *  - ALLOWED_ORIGIN  e.g. https://<user>.github.io/<repo> (or * while testing)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ORIGIN = process.env.ALLOWED_ORIGIN ?? "*";
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();

  const base = process.env.BASE_URL;
  if (!base) return res.status(500).json({ error: "Missing BASE_URL" });

  // Frontend calls like: /api/proxy?path=/movie/550&lang=en-US
  const path = (req.query.path as string) || "/";
  const upstream = new URL(base + path);

  // Copy query params except 'path'
  const entries = new URLSearchParams(req.query as Record<string, string>).entries();
  for (const [k, v] of entries) if (k !== "path") upstream.searchParams.set(k, v);

  // Inject API key if provided
  if (process.env.API_KEY) upstream.searchParams.set("api_key", process.env.API_KEY);

  // Prepare request to upstream
  const method = req.method || "GET";
  let body: BodyInit | undefined;
  const contentType = (req.headers["content-type"] || "").toString();

  if (method !== "GET" && method !== "HEAD") {
    if (typeof req.body === "string") {
      body = req.body;
    } else if (req.body && contentType.includes("application/json")) {
      body = JSON.stringify(req.body);
    } else if (req.body) {
      // fallback – not perfect for multipart; keep GETs if possible
      body = req.body as any;
    }
  }

  const upstreamResp = await fetch(upstream.toString(), {
    method,
    headers: {
      "Accept": "application/json",
      // Forward bearer token if you need to (optional):
      "Authorization": (req.headers["authorization"] as string) || "",
      "Content-Type": contentType || "application/json"
    },
    body
  });

  // Stream response through and keep CORS header
  const buf = Buffer.from(await upstreamResp.arrayBuffer());
  upstreamResp.headers.forEach((v, k) => res.setHeader(k, v));
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.status(upstreamResp.status).send(buf);
}
