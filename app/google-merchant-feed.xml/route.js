import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// This feed is registered in Google Merchant Center against this exact
// domain, so links inside it must use it regardless of what domain the app
// is otherwise reached at (NEXT_PUBLIC_SITE_URL) — Merchant Center rejects
// product links that don't match the verified store domain.
const FEED_SITE_URL = "https://www.lutediamonds.com";
const BRAND_NAME = "Lute Diamonds";
const CURRENCY = "ZAR";

// Always fetch fresh from the database — never statically cache this route.
export const dynamic = "force-dynamic";

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html = "") {
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function absoluteUrl(src) {
  if (!src) return "";
  return src.startsWith("http") ? src : `${FEED_SITE_URL}${src}`;
}

function buildItemXml(product) {
  const id = String(product._id);
  const title = escapeXml(product.name);
  const description = escapeXml(
    stripHtml(product.metaDescription || product.description).slice(0, 5000)
  );
  const link = escapeXml(`${FEED_SITE_URL}/product/${product.slug}`);
  const images = (product.images || []).map(absoluteUrl).filter(Boolean);
  const [imageLink, ...extraImages] = images;
  const availability = product.stock > 0 ? "in_stock" : "out_of_stock";
  const price = `${Number(product.price).toFixed(2)} ${CURRENCY}`;
  const productType = escapeXml(product.category?.name || "Jewellery");
  const material = product.specs?.metal ? escapeXml(product.specs.metal) : "";
  const size = product.specs?.size ? escapeXml(product.specs.size) : "";
  // Handcrafted/certified pieces don't have retail barcodes, but the gem
  // certificate number (e.g. "EGLSA 220610580") is a genuine per-item
  // identifier we already store, so use it as MPN when present. Some
  // products have "N/A" typed into this field (uncertified pieces like a
  // plain band) — that's a placeholder, not an identifier, so it must be
  // excluded rather than submitted as a fake shared MPN.
  const certificate = (product.specs?.certificate || "").trim();
  const mpn = certificate && certificate.toLowerCase() !== "n/a" ? escapeXml(certificate) : "";

  return `
    <item>
      <g:id>${id}</g:id>
      <title>${title}</title>
      <description>${description}</description>
      <link>${link}</link>
      ${imageLink ? `<g:image_link>${escapeXml(imageLink)}</g:image_link>` : ""}
      ${extraImages
        .slice(0, 10)
        .map((img) => `<g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
        .join("\n      ")}
      <g:availability>${availability}</g:availability>
      <g:price>${price}</g:price>
      <g:brand>${BRAND_NAME}</g:brand>
      <g:condition>new</g:condition>
      ${mpn ? `<g:mpn>${mpn}</g:mpn>` : `<g:identifier_exists>no</g:identifier_exists>`}
      <g:product_type>${productType}</g:product_type>
      <g:google_product_category>Apparel &amp; Accessories &gt; Jewelry</g:google_product_category>
      ${material ? `<g:material>${material}</g:material>` : ""}
      ${size ? `<g:size>${size}</g:size>` : ""}
    </item>`;
}

export async function GET() {
  await connectDB();
  const products = await Product.find().populate("category", "name").lean();

  const itemsXml = products.map(buildItemXml).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${BRAND_NAME} Product Feed</title>
    <link>${FEED_SITE_URL}</link>
    <description>Google Merchant Center product feed for ${BRAND_NAME}</description>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
