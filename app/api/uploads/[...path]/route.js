import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MIME = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  webp: "image/webp", gif: "image/gif", avif: "image/avif",
  svg: "image/svg+xml",
};

export async function GET(req, { params }) {
  const { path: p } = await params;

  const base = path.join(process.cwd(), "public", "uploads");
  const file = path.resolve(base, p.join("/"));

  if (!file.startsWith(base)) {
    return new Response("Forbidden", { status: 403 });
  }
  if (!fs.existsSync(file)) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(file).slice(1).toLowerCase();
  return new Response(new Uint8Array(fs.readFileSync(file)), {
    headers: {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
