import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ORIGIN = process.env.ALLOWED_ORIGIN ?? "*";
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const base = process.env.BASE_URL;
  if (!base) return res.status(500).json({ error: "Missing BASE_URL" });

  const path = (req.query.path as string) || "/";
  const upstream = new URL(base + path);

  // copy query params except 'path'
  const qp = new URLSearchParams(req.query as Record<string, string>);
  qp.forEach((v, k) => { if (k !== "path") upstream.searchParams.set(k, v); });

  const method = req.method || "GET";
  const contentType = (req.headers["content-type"] || "").toString();

  // only send body on non-GET/HEAD
  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD") {
    if (typeof req.body === "string") body = req.body;
    else if (req.body && contentType.includes("application/json")) body = JSON.stringify(req.body);
    else if (req.body) body = req.body as any;
  }

  const upstreamResp = await fetch(upstream.toString(), {
    method,
    headers: {
      Accept: "application/json",
      // Use one auth method appropriate for your API. If you need a query param instead, add it above.
      ...(process.env.API_KEY ? { Authorization: `Bearer ${process.env.API_KEY}` } : {}),
      // Do NOT send Content-Type on GET; many APIs dislike that.
      ...(method !== "GET" && contentType ? { "Content-Type": contentType } : {}),
    },
    body,
  });

  // Copy headers but strip compression/length (body is already decompressed)
  res.status(upstreamResp.status);
  upstreamResp.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "content-encoding" || k === "content-length" || k === "transfer-encoding") return;
    res.setHeader(key, value);
  });
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);

  const buf = Buffer.from(await upstreamResp.arrayBuffer());
  res.send(buf);
}
