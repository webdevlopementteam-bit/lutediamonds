// app/blog/page.jsx
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import Breadcrumbs from "@/components/Breadcrumbs";
import GalleryStrip from "@/components/GalleryStrip";

const RECENT_LIMIT = 4;

function formatDate(d) {
  if (!d) return "";
  return new Date(d)
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();
}

const SearchIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const metadata = {
  title: "Blog | Lute Diamonds",
  description: "Stories, styling notes and care guides from the Lute Diamonds workshop.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }) {
  const sp = await searchParams;
  const q = (sp?.q || "").trim();

  await connectDB();

  const query = q
    ? {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { excerpt: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const [posts, recentPosts] = await Promise.all([
    BlogPost.find(query).sort({ createdAt: -1 }).lean(),
    BlogPost.find().sort({ createdAt: -1 }).limit(RECENT_LIMIT).lean(),
  ]);

  return (
    <div>
      <Breadcrumbs title="Blog" items={[{ label: "Blog" }]} />

      {/* page header */}
      <div className="container-lute mt-8 text-center px-4">
        <h1 className="text-[26px] sm:text-[32px] md:text-[42px] font-medium leading-tight tracking-[-0.02em] text-[#141414]">
          Our Latest Blog
        </h1>
        <p className="mx-auto mt-3 md:mt-4 max-w-[720px] text-sm font-medium text-[#5A5A5A] md:text-[15px]">
          Adorn Yourself in Glamour: Find Your Perfect Piece Today
        </p>
      </div>

      {/* search bar - right after header, above everything */}
      <div className="container-lute mt-8 md:mt-10 px-4">
        <form action="/blog" method="get" className="relative max-w-xl mx-auto">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="w-full rounded-lg bg-[#F5F5F5] py-3.5 md:py-4 pl-5 pr-12 text-[14px] md:text-[15px] text-[#141414] outline-none transition-shadow placeholder:text-[#9A9A9A] focus:ring-2 focus:ring-[#BF9A3A]/40"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] transition-colors hover:text-[#BF9A3A]"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </form>
      </div>

      <div className="container-lute mt-10 md:mt-14 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
        {/* ---------- posts ---------- */}
        <div>
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 bg-[#FAF8F4] px-6 py-12 md:py-16 text-center">
              <p className="text-[15px] md:text-[17px] font-medium text-[#141414]">
                {q ? `No articles found for “${q}”` : "No articles published yet"}
              </p>
              {q && (
                <Link
                  href="/blog"
                  className="mt-5 inline-block rounded-md bg-[#141414] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#BF9A3A]"
                >
                  Clear search
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-black/10">
              {posts.map((post, i) => (
                <article key={String(post._id)} className={i === 0 ? "pb-8 md:pb-12" : "py-8 md:py-12"}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    {post.coverImage && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl md:rounded-2xl bg-[#F1ECE2]">
                        <Image
                          src={post.coverImage}
                          alt={post.coverImageAlt || post.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 65vw"
                          priority={i === 0}
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                    )}

                    <p className="mt-4 md:mt-6 text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8A8A8A]">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </p>

                    <h2 className="mt-2 md:mt-3 text-[20px] sm:text-[26px] md:text-[32px] font-medium leading-snug text-[#141414] transition-colors group-hover:text-[#BF9A3A]">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="mt-3 md:mt-4 line-clamp-3 text-[14px] md:text-[16px] leading-[1.7] md:leading-[1.75] text-[#3F4A55]">
                        {post.excerpt}
                      </p>
                    )}

                    <span className="mt-4 md:mt-6 inline-block text-[13px] md:text-[14px] font-semibold text-[#141414] underline decoration-1 underline-offset-[6px] transition-colors group-hover:text-[#BF9A3A]">
                      Read More
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* ---------- sidebar ---------- */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          {recentPosts.length > 0 && (
            <div>
              <h3 className="text-[18px] md:text-[22px] font-medium text-[#141414]">Recent Posts</h3>
              <ul className="mt-5 md:mt-6 space-y-4 md:space-y-5">
                {recentPosts.map((post) => (
                  <li key={String(post._id)}>
                    <Link href={`/blog/${post.slug}`} className="group flex items-start gap-3 md:gap-4">
                      <div className="relative h-[64px] w-[78px] md:h-[72px] md:w-[88px] shrink-0 overflow-hidden rounded-lg bg-[#F1ECE2]">
                        {post.coverImage && (
                          <Image
                            src={post.coverImage}
                            alt={post.coverImageAlt || post.title}
                            fill
                            sizes="88px"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">
                          {formatDate(post.publishedAt || post.createdAt)}
                        </p>
                        <p className="mt-1 md:mt-1.5 text-[14px] md:text-[15px] font-medium leading-snug text-[#141414] transition-colors group-hover:text-[#BF9A3A]">
                          {post.title}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <GalleryStrip />
    </div>
  );
}