// app/product/[slug]/page.jsx
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import AddToCartBox from "@/components/AddToCartBox";
import SpecsTable from "@/components/SpecsTable";
import StarRating from "@/components/StarRating";
import Breadcrumbs from "@/components/Breadcrumbs";
import ReviewSection from "@/components/ReviewSection";
import { formatZAR } from "@/lib/format";
import { getWishlistIds } from "@/lib/wishlist";
import { toPlain } from "@/lib/serialize";
import { buildProductSchema } from "@/lib/schema";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const TruckIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M3 7.5h11v9H3zM14 11h4l3 3v2.5h-7z" />
    <circle cx="7" cy="17.5" r="1.6" />
    <circle cx="17" cy="17.5" r="1.6" />
  </svg>
);
const CardIcon = (p) => (
  <svg {...iconProps} {...p}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 10h18M6.5 14.5h3" />
  </svg>
);
const ShieldIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M12 3.5 19 6v5.5c0 4.3-3 7.3-7 9-4-1.7-7-4.7-7-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const TRUST = [
  { Icon: TruckIcon, title: "Free shipping", sub: "& easy exchanges" },
  { Icon: CardIcon, title: "Flexible payment", sub: "via PayGate" },
  { Icon: ShieldIcon, title: "Secure checkout", sub: "trusted by thousands" },
];

function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  if (!product) return {};

  const title = product.metaTitle || `${product.name} | Lute Diamonds`;
  const description = product.metaDescription || stripHtml(product.description).slice(0, 160);

  return {
    title,
    description,
    keywords: product.keywords?.length ? product.keywords : undefined,
    openGraph: {
      title,
      description,
      images: product.images?.length ? [product.images[0]] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images?.length ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  await connectDB();

  const rawProduct = await Product.findOne({ slug }).populate("category", "name slug").lean();
  if (!rawProduct) notFound();

  const [rawRelated, rawReviews, wishlistIds] = await Promise.all([
    Product.find({ category: rawProduct.category?._id, _id: { $ne: rawProduct._id } })
      .limit(4)
      .lean(),
    Review.find({ product: rawProduct._id }).sort({ createdAt: -1 }).lean(),
    getWishlistIds(),
  ]);

  const product = toPlain(rawProduct);
  const related = toPlain(rawRelated);
  const reviews = toPlain(rawReviews);

  const onSale = product.compareAtPrice > product.price;
  const discount = onSale
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;
  const eyebrow = product.collectionTag || product.category?.name;
  const productSchema = buildProductSchema(product);

  return (
    <div className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* ---------- main ---------- */}
      <div className="container-lute mt-8 grid gap-10 lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
        {/* gallery */}
        <div className="min-w-0 lg:sticky lg:top-32 lg:self-start">
          <ProductGallery images={product.images} name={product.name} alt={product.imagesAlt} />
        </div>

        {/* info */}
        <div className="min-w-0 lg:max-w-[560px]">
          {eyebrow && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#BF9A3A]">
              {eyebrow}
            </span>
          )}

          <h1 className="mt-2.5 text-[26px] font-medium leading-[1.15] tracking-[-0.01em] text-[#141414] sm:text-[34px]">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <StarRating value={product.ratingAvg} count={product.ratingCount} />
            <span
              className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${
                inStock ? "text-emerald-700" : "text-red-600"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
              {inStock ? (lowStock ? `Only ${product.stock} left` : "In stock") : "Out of stock"}
            </span>
          </div>

          {/* price */}
          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="text-[30px] font-medium tracking-[-0.01em] text-[#141414] sm:text-[34px]">
              {formatZAR(product.price)}
            </span>
            {onSale && (
              <>
                <span className="text-[16px] text-[#9A9A9A] line-through">
                  {formatZAR(product.compareAtPrice)}
                </span>
                <span className="rounded-full bg-[#F7F1E5] px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[#8A6E1F]">
                  Save {discount}%
                </span>
              </>
            )}
          </div>
          <p className="mt-1.5 text-[12.5px] text-[#9A9A9A]">Incl. VAT &middot; Free shipping</p>

          <div className="mt-7 h-px w-full bg-black/[0.08]" />

          <div className="mt-8">
            <AddToCartBox
              product={product}
              initialWishlisted={wishlistIds.includes(product._id.toString())}
            />
          </div>

          {/* trust — compact 3-up */}
          <ul className="mt-8 grid grid-cols-3 gap-3 rounded-2xl bg-[#FAF8F4] p-4">
            {TRUST.map(({ Icon, title, sub }) => (
              <li key={title} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#BF9A3A] shadow-sm">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span>
                  <span className="block text-[12.5px] font-medium leading-tight text-[#141414]">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-tight text-[#8A8A8A]">
                    {sub}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {/* specs */}
          <div className="mt-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A8A8A]">
              Specifications
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-black/[0.09]">
              <SpecsTable specs={product.specs} />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- description ---------- */}
      {product.description && (
        <section className="container-lute mt-20 border-t border-black/[0.08] pt-14">
          <div
            className="rich-content w-full text-[15px] leading-[1.8] text-[#4A4A4A]"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}

      {/* ---------- reviews ---------- */}
      <section className="container-lute mt-20 border-t border-black/[0.08] pt-14">
        <h2 className="text-[22px] font-medium tracking-[-0.01em] text-[#141414] sm:text-[28px]">
          Reviews
        </h2>
        <div className="mt-7">
          <ReviewSection productId={product._id.toString()} reviews={reviews} />
        </div>
      </section>

      {/* ---------- related ---------- */}
      {related.length > 0 && (
        <section className="container-lute mt-20 border-t border-black/[0.08] pt-14">
          <h2 className="text-[22px] font-medium tracking-[-0.01em] text-[#141414] sm:text-[28px]">
            You May Also Like
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                initialWishlisted={wishlistIds.includes(p._id.toString())}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}