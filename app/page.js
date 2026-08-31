import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/ProductCard";
import { getWishlistIds } from "@/lib/wishlist";
import { toPlain } from "@/lib/serialize";
import HeroSlider from "@/components/HeroSlider";
import PromoBanner from "@/components/PromoBanner";
import Marquee from "@/components/Marquee";
import MoreAboutUs from "@/components/MoreAboutUs";
import BestSellersSection from "@/components/BestSellersSection";
import CategoryBanner from "@/components/CategoryBanner";
import TrendingWeek from "@/components/TendingWeek";
import HandmadeJewellerySection from "@/components/HandmadeJewellerySection";
import Testimonials from "@/components/Testimonials";
import CuratedYou from "@/components/CuratedYou";
import LatestBlog from "@/components/LatestBlog";
import GalleryStrip from "@/components/GalleryStrip";
import WhyChooseTanzanite from "@/components/WhyChooseTanzanite";
import TanzaniteFAQ from "@/components/TanzaniteFAQ";

export const revalidate = 0;

export const metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  await connectDB();

  const [categories, featured, latest] = await Promise.all([
    Category.find({ parent: null }).limit(4).lean(),
    Product.find({ featured: true }).populate("category", "name slug").limit(8).lean(),
    Product.find().sort({ createdAt: -1 }).populate("category", "name slug").limit(8).lean(),
  ]);

  const wishlistIds = await getWishlistIds();
  const products = toPlain(featured.length ? featured : latest).map((p) => ({
    ...p,
    initialWishlisted: wishlistIds.includes(p._id),
  }));

  return (
    <div>


      <HeroSlider />

      <PromoBanner
        items={[
          {
            tag: "Our rings",
            title: "Add These To Your Style Roster",
            description: "Handcrafted rings featuring rare sapphires and diamonds, made to shine for a lifetime — only at Lute Diamonds.",
            buttonText: "Shop now",
            buttonLink: "/product-category/wedding-rings",
            image: "/home/ring-banner.png",
          },
          {
            tag: "Favourite picks",
            title: "Unique Diamond Pendants",
            description: "From classic diamonds to rare, one-of-a-kind gemstones, find a pendant that tells your story — only at Lute Diamonds.",
            buttonText: "Shop now",
            buttonLink: "/product-category/pendants",
            image: "/home/pendants-banner.png",
          },
        ]}
      />

      <Marquee
        items={[
          "The Iconic Collection",
          "Color In Your Look",
          "Elegant And Everlasting",
          "Black Friday Offer",
        ]}
      />

      <MoreAboutUs />

      <BestSellersSection products={products} />

      <CategoryBanner
        items={[
          {
            image: "/home/ring-category.png",
            title: "One-Of-A-Kinds",
            category: "Rings",
            description: "Featuring unique and hand-sourced gemstones from all over the world.",
            buttonText: "See more products",
            buttonLink: "/product-category/wedding-rings",
          },
          {
            image: "/home/pendant-category.png",
            title: "High Tide Looks",
            category: "Pendant",
            description: "Featuring unique and hand-sourced gemstones from all over the world.",
            buttonText: "See more products",
            buttonLink: "/product-category/pendants",
          },
          {
            image: "/home/earring-category.png",
            title: "New Organic Dome",
            category: "Earrings",
            description: "From solid gold staples to diamond jewelry, browse our most-loved pieces.",
            buttonText: "See more products",
            buttonLink: "/product-category/earrings",
          },
          {
            image: "/home/rings-category.jpeg",
            title: "The Tiffany Icons",
            category: "Rings",
            description: "Rings is a symbol of serenity, and alignment with the pace of nature.",
            buttonText: "See more products",
            buttonLink: "/product-category/wedding-rings",
          },
        ]}
      />

      <TrendingWeek products={products} />

      <PromoBanner
        items={[
          {
            tag: "TIMELESS ELEGANCE",
            title: "Rings Made For Forever",
            description: "Discover handcrafted rings set with brilliant diamonds, designed to celebrate life's most precious moments.",
            buttonText: "Shop now",
            buttonLink: "/product-category/wedding-rings",
            image: "/home/banner-ring.jpeg",
          },
          {
            tag: "SIGNATURE COLLECTION",
            title: "Sparkle In Every Detail",
            description: "Delicate diamond studs crafted to add a touch of brilliance to your everyday look.",
            buttonText: "Shop now",
            buttonLink: "/product-category/earrings",
            image: "/home/banner-earring.jpeg",
          },
        ]}
      />

      <Marquee
        items={[
          "Handcrafted Jewellery, Made To Last",
          "Ethically Sourced Diamonds & Gemstones",
          "Proudly Serving South Africa",
        ]}
      />

      <HandmadeJewellerySection
        image="/home/bannerhandmade.jpeg"
        tag="Our challenge to do better"
        title="All Of Our Jewellery Is Handmade."
        description="A gift they'll treasure forever, Lute Diamonds created diamonds jewellery combines precious metals with laboratory grown diamonds to form captivating collections."
        buttonText="Explore More"
        buttonLink="/about"
      />

      <Testimonials />
      <CuratedYou />
      <WhyChooseTanzanite/>
      <LatestBlog />
      <GalleryStrip />
      <TanzaniteFAQ/>
    </div>
  );
}

