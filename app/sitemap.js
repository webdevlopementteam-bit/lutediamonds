import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import BlogPost from "@/models/BlogPost";

const SITE_URL = "https://www.lutediamonds.com";

// Regenerate at most once a day, not once a build — keeps the sitemap
// current without hitting the database on every single crawler request.
export const revalidate = 86400;

const STATIC_ROUTES = [
  "",
  "/about",
  "/shop",
  "/blog",
  "/contact",
  "/faq",
  "/terms",
  "/privacy",
  "/delivery-returns",
  "/order-tracking",
  "/cart",
  "/wishlist",
  "/account/login",
];

export default async function sitemap() {
  await connectDB();

  const [products, categories, posts] = await Promise.all([
    Product.find().select("slug updatedAt").lean(),
    Category.find().select("slug updatedAt").lean(),
    BlogPost.find().select("slug updatedAt").lean(),
  ]);

  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "" ? 1.0 : 0.8,
  }));

  const categoryEntries = categories.map((c) => ({
    url: `${SITE_URL}/product-category/${c.slug}`,
    lastModified: c.updatedAt || now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const productEntries = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt || now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const blogEntries = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt || now,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries, ...blogEntries];
}
