// components/LatestBlog.jsx  — server component (async)
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

const HEADING = "Our Latest Blog";
const SUBHEADING = "Adorn Yourself in Glamour: Find Your Perfect Piece Today";
const LIMIT = 4;

function formatDate(d) {
  if (!d) return "";
  return new Date(d)
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();
}

function truncate(str = "", max = 115) {
  const clean = String(str).replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}..` : clean;
}

export default async function LatestBlog() {
  await connectDB();
  const posts = await BlogPost.find()
    .sort({ createdAt: -1 })
    .limit(LIMIT)
    .lean();

  if (!posts.length) return null;

  return (
    <section className="w-full bg-white py-14 md:py-16">
      {/* heading */}
      <div className="px-[30px] text-center">
        <h2 className="text-[30px] font-medium leading-tight tracking-[-0.02em] text-[#141414] md:text-[40px]">
          {HEADING}
        </h2>
        <p className="mx-auto mt-4 max-w-[720px] text-sm font-medium text-[#5A5A5A] md:text-[15px]">
          {SUBHEADING}
        </p>
      </div>

      {/* cards */}
      <div className="mt-10 grid grid-cols-1 gap-10 px-[30px] sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => {
          const category = post.category || post.keywords?.[0] || "Jewellery";
          const date = formatDate(post.publishedAt || post.createdAt);

          return (
            <Link
              key={String(post._id)}
              href={`/blog/${post.slug}`}
              className="group flex flex-col text-center"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#F1ECE2]">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.coverImageAlt || post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
              </div>

              <p className="mt-6 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">
                {category} &mdash; {date}
              </p>

              <h3 className="mt-3 text-[20px] font-medium leading-snug text-[#141414] transition-colors group-hover:text-[#BF9A3A] md:text-[22px]">
                {post.title}
              </h3>

              {post.excerpt && (
                <p className="mt-4 text-[15px] leading-[1.7] text-[#4A4A4A]">
                  {truncate(post.excerpt)}
                </p>
              )}

              <span className="mt-auto pt-6 text-[14px] font-semibold text-[#141414] underline decoration-1 underline-offset-[6px] transition-colors group-hover:text-[#BF9A3A]">
                Read More
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}