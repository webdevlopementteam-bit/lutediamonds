// app/shop/page.jsx
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Breadcrumbs from "@/components/Breadcrumbs";
import SortSelect from "@/components/SortSelect";
import ShopSearchBar from "@/components/ShopSearchBar";
import PriceFilter from "@/components/PriceFilter";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";
import { getWishlistIds } from "@/lib/wishlist";
import { toPlain } from "@/lib/serialize";
import GalleryStrip from "@/components/GalleryStrip";
import { formatZAR } from "@/lib/format";

const SORT_MAP = {
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { ratingAvg: -1 },
  latest: { createdAt: -1 },
  default: { createdAt: -1 },
};

/* user ke type kiye special chars ko regex me safe banao */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const metadata = {
  title: "Shop All Jewellery UK & Europe | Lute Diamonds",
  description:
    "Browse our full collection of certified diamond and Tanzanite jewellery — rings, pendants & earrings. Handcrafted, delivered across the UK & Europe.",
  keywords: [
    "Shop diamond jewellery", "shop Tanzanite Jewellery", "Buy jewellery online in Uk", "buy diamond jewellery online in Europe",
  ],
}

export default async function ShopPage({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const limit = Math.min(60, Math.max(1, parseInt(sp.show || "16", 10) || 16));
  const sort = sp.sort || "default";

  /* header `?q=` bhejta hai, sidebar `?search=` — dono support karo */
  const term = (sp.search || sp.q || "").trim();

  await connectDB();

  const query = {};
  if (sp.category) query.category = sp.category;
  if (term) {
    const rx = { $regex: escapeRegex(term), $options: "i" };
    query.$or = [{ name: rx }, { description: rx }];
  }
  if (sp.minPrice || sp.maxPrice) {
    query.price = {};
    if (sp.minPrice) query.price.$gte = Number(sp.minPrice);
    if (sp.maxPrice) query.price.$lte = Number(sp.maxPrice);
  }

  const [rawItems, total, categories, recentRaw] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort(SORT_MAP[sort] || SORT_MAP.default)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
    Category.find().sort({ name: 1 }).lean(),
    Product.find().sort({ createdAt: -1 }).limit(3).lean(),
  ]);

  const items = toPlain(rawItems);
  const recentProducts = toPlain(recentRaw);

  // category-wise product counts
  const categoryCounts = await Promise.all(
    categories.map((c) => Product.countDocuments({ category: c._id }))
  );

  const wishlistIds = await getWishlistIds();
  const pages = Math.max(1, Math.ceil(total / limit));

  function buildHref(p) {
    const params = new URLSearchParams(sp);
    params.set("page", String(p));
    return `/shop?${params.toString()}`;
  }

  /* ek filter hata kar baaki bachao */
  function hrefWithout(...keys) {
    const params = new URLSearchParams(sp);
    keys.forEach((k) => params.delete(k));
    params.delete("page");
    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const activeCategory = categories.find((c) => c._id.toString() === sp.category);
  const hasPrice = Boolean(sp.minPrice || sp.maxPrice);
  const activeCount = [Boolean(sp.category), hasPrice].filter(Boolean).length;

  /* ---------- sidebar blocks (desktop + drawer dono me use hote hain) ---------- */
  const CategoriesBlock = ({ inDrawer = false }) => (
    <div className={inDrawer ? "" : "border-b border-border pb-6"}>
      <h3 className={inDrawer ? "mb-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8A8A8A]" : "font-serif text-lg mb-4"}>
        Categories
      </h3>
      <ul className={inDrawer ? "space-y-1" : "space-y-2.5 text-sm"}>
        {sp.category && inDrawer && (
          <li>
            <Link
              href={hrefWithout("category")}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] text-[#5A5A5A] active:bg-[#FAF8F4]"
            >
              <span>All products</span>
            </Link>
          </li>
        )}
        {categories.map((c, i) => {
          const active = sp.category === c._id.toString();
          return (
            <li key={c._id.toString()}>
              <Link
                href={active ? hrefWithout("category") : `/shop?category=${c._id}`}
                className={
                  inDrawer
                    ? `flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] transition-colors ${
                        active ? "bg-[#FBF7EE] font-medium text-[#BF9A3A]" : "text-[#1B1B1B] active:bg-[#FAF8F4]"
                      }`
                    : `flex items-center justify-between hover:text-gold ${
                        active ? "text-gold font-medium" : "text-foreground"
                      }`
                }
              >
                <span>{c.name}</span>
                <span className={inDrawer ? "text-[13px] text-[#9A9A9A]" : "text-muted"}>
                  {inDrawer ? categoryCounts[i] : `(${categoryCounts[i]})`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const PriceBlock = ({ inDrawer = false }) => (
    <div className={inDrawer ? "" : "border-b border-border pb-6"}>
      <h3 className={inDrawer ? "mb-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8A8A8A]" : "font-serif text-lg mb-4"}>
        Filter By Price
      </h3>
      <PriceFilter defaultMin={sp.minPrice} defaultMax={sp.maxPrice} category={sp.category} />
    </div>
  );

  return (
    <div>
      <Breadcrumbs title="Shop" items={[{ label: "Shop" }]} />

      <div className=" bg-white">
        <div className="grid md:grid-cols-[280px_1fr] gap-10 py-8 md:py-12 container-lute">
          {/* ---------- Sidebar (desktop only — waisa hi jaisa tha) ---------- */}
          <aside className="hidden md:block space-y-8">
            <ShopSearchBar defaultValue={term} />
            <CategoriesBlock />
            <PriceBlock />

            {recentProducts.length > 0 && (
              <div>
                <h3 className="font-serif text-lg mb-4">Recent Products</h3>
                <ul className="space-y-4">
                  {recentProducts.map((p) => (
                    <li key={p._id}>
                      <Link href={`/product/${p.slug}`} className="flex items-center gap-3 group">
                        <div className="w-14 h-14 rounded overflow-hidden bg-gold-light shrink-0">
                          {p.images?.[0] && (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span className="text-sm leading-snug group-hover:text-gold">{p.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* ---------- Main content ---------- */}
          <div className="min-w-0">
            {/* mobile: search + filters + sort */}
            <div className="mb-5 space-y-3 md:hidden">
              <ShopSearchBar defaultValue={term} />
              <div className="grid grid-cols-2 gap-2.5">
                <MobileFilterDrawer activeCount={activeCount}>
                  <div className="space-y-7">
                    <CategoriesBlock inDrawer />
                    <PriceBlock inDrawer />
                  </div>
                </MobileFilterDrawer>
                <SortSelect />
              </div>
            </div>

            {/* active filter chips — mobile */}
            {(activeCount > 0 || term) && (
              <div className="mb-4 flex flex-wrap items-center gap-2 md:hidden">
                {term && (
                  <Chip href={hrefWithout("search", "q")}>&ldquo;{term}&rdquo;</Chip>
                )}
                {activeCategory && (
                  <Chip href={hrefWithout("category")}>{activeCategory.name}</Chip>
                )}
                {hasPrice && (
                  <Chip href={hrefWithout("minPrice", "maxPrice")}>
                    {sp.minPrice ? formatZAR(Number(sp.minPrice)) : "Min"} &ndash;{" "}
                    {sp.maxPrice ? formatZAR(Number(sp.maxPrice)) : "Max"}
                  </Chip>
                )}
                <Link
                  href="/shop"
                  className="text-[12.5px] font-medium uppercase tracking-wide text-[#8A8A8A] underline underline-offset-4"
                >
                  Clear all
                </Link>
              </div>
            )}

            {/* desktop: search results line */}
            {term && (
              <div className="mb-5 hidden flex-wrap items-center gap-3 md:flex">
                <p className="text-sm text-muted">
                  Search results for{" "}
                  <span className="font-medium text-foreground">&ldquo;{term}&rdquo;</span>
                </p>
                <Link
                  href="/shop"
                  className="text-xs font-medium uppercase tracking-wide text-gold hover:underline"
                >
                  Clear
                </Link>
              </div>
            )}

            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <p className="text-sm text-muted">
                Showing {start}–{end} of {total} results
              </p>
              <div className="hidden md:block">
                <SortSelect />
              </div>
            </div>

            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/15 bg-[#FAF8F4] px-5 py-12 text-center md:bg-transparent md:border-0 md:px-0 md:py-0 md:text-left">
                <p className="text-muted">
                  {term ? `No products match “${term}”.` : "No products found."}
                </p>
                {(activeCount > 0 || term) && (
                  <Link
                    href="/shop"
                    className="mt-4 inline-block rounded-lg bg-[#141414] px-5 py-2.5 text-sm font-medium text-white md:hidden"
                  >
                    Clear filters
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 lg:grid-cols-3">
                {items.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    initialWishlisted={wishlistIds.includes(p._id.toString())}
                  />
                ))}
              </div>
            )}

            <Pagination page={page} pages={pages} buildHref={buildHref} />

            {/* ---------- Recent Products — mobile, products ke NEECHE ---------- */}
            {recentProducts.length > 0 && (
              <div className="mt-12 border-t border-border pt-8 md:hidden">
                <h3 className="font-serif text-lg mb-4">Recent Products</h3>
                <div className="grid grid-cols-3 gap-3">
                  {recentProducts.map((p) => (
                    <Link key={p._id} href={`/product/${p.slug}`} className="group block">
                      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gold-light">
                        {p.images?.[0] && (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-foreground">
                        {p.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <GalleryStrip />
    </div>
  );
}

/* filter chip */
function Chip({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[13px] text-[#1B1B1B]"
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="h-3 w-3 text-[#9A9A9A]"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </Link>
  );
}