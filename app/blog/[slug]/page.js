import { notFound } from "next/navigation";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildBlogPostSchema } from "@/lib/schema";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const post = await BlogPost.findOne({ slug }).lean();
  if (!post) return {};

  const title = post.metaTitle || `${post.title} | Lute Diamonds`;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    keywords: post.keywords?.length ? post.keywords : undefined,
    openGraph: {
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  await connectDB();
  const post = await BlogPost.findOne({ slug }).lean();
  if (!post) notFound();

  const blogSchema = buildBlogPostSchema(post);

  return (
    <article className=" pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
      <h1 className="font-serif text-3xl mb-6 container-lute max-w-3xl mt-20">{post.title}</h1>
      {post.coverImage && (
        <div className="aspect-video bg-gold-light relative overflow-hidden rounded-lg mb-8 container-lute max-w-3xl">
          <Image src={post.coverImage} alt={post.coverImageAlt || post.title} fill sizes="768px" className="object-cover" priority />
        </div>
      )}
      <div className="rich-content container-lute max-w-3xl" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
