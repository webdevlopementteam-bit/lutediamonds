import { notFound } from "next/navigation";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Breadcrumbs from "@/components/Breadcrumbs";
import SortSelect from "@/components/SortSelect";
import { getWishlistIds } from "@/lib/wishlist";
import { toPlain } from "@/lib/serialize";

const SORT_MAP = {
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { ratingAvg: -1 },
  latest: { createdAt: -1 },
  default: { createdAt: -1 },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const category = await Category.findOne({ slug }).select("name").lean();
  if (!category) return {};

  return {
    title: `${category.name} | Lute Diamonds`,
    description: null,
    keywords: [category.name],
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const limit = 15;
  const sort = sp.sort || "default";

  await connectDB();

  const category = await Category.findOne({ slug }).lean();
  if (!category) notFound();

  const query = { category: category._id };

  const [rawItems, total] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort(SORT_MAP[sort] || SORT_MAP.default)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);
  const items = toPlain(rawItems);

  const wishlistIds = await getWishlistIds();
  const pages = Math.max(1, Math.ceil(total / limit));

  function buildHref(p) {
    const params = new URLSearchParams(sp);
    params.set("page", String(p));
    return `/product-category/${slug}?${params.toString()}`;
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: category.name }]} />

      {category.image && (
        <div className="aspect-[3/1] relative rounded-lg overflow-hidden bg-gold-light mb-8">
          <Image src={category.image} alt={category.imageAlt || category.name} fill sizes="100vw" className="object-cover" priority />
        </div>
      )}

      <h1 className="font-serif text-3xl container-lute mt-20 mb-2">{category.name}</h1>
      {category.description && <p className="text-muted max-w-2xl container-lute mb-8">{category.description}</p>}

      <div className="flex items-center justify-between container-lute mb-6">
        <p className="text-sm text-muted">{total} products</p>
        <SortSelect />
      </div>

      {items.length === 0 ? (
        <p className="text-muted pb-16 container-lute">No products found in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 container-lute mb-20">
          {items.map((p) => (
            <ProductCard key={p._id} product={p} initialWishlisted={wishlistIds.includes(p._id.toString())} />
          ))}
        </div>
      )}

      <Pagination page={page} pages={pages} buildHref={buildHref} />
    </div>
  );
}
