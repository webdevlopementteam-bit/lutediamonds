const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
const BRAND_NAME = "Lute Diamonds";

function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function absoluteUrl(src) {
  if (!src) return undefined;
  return src.startsWith("http") ? src : `${SITE_URL}${src}`;
}

export function buildProductSchema(product) {
  const url = `${SITE_URL}/product/${product.slug}`;
  const images = (product.images || []).map(absoluteUrl).filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images.length ? images : undefined,
    description: stripHtml(product.description).slice(0, 5000) || undefined,
    sku: product._id ? String(product._id) : undefined,
    brand: { "@type": "Brand", name: BRAND_NAME },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "ZAR",
      price: product.price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  if (product.ratingCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingAvg,
      reviewCount: product.ratingCount,
    };
  }

  return schema;
}

export function buildBlogPostSchema(post) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = absoluteUrl(post.coverImage);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: image ? [image] : undefined,
    description: post.excerpt || stripHtml(post.content).slice(0, 300) || undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: BRAND_NAME },
    publisher: { "@type": "Organization", name: BRAND_NAME },
  };
}
