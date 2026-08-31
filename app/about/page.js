
import AboutBanner from "@/components/AboutBanner";
import FinishingTouchSection from "@/components/FinishingTouchSection";
import GalleryStrip from "@/components/GalleryStrip";
import HandmadeJewellerySection from "@/components/HandmadeJewellerySection";
import SignatureSparkleSection from "@/components/SignatureSparkleSection";
import StorySection from "@/components/StorySection";
import TeamSection from "@/components/TeamSection";

export const metadata = {
  title: "About | Lute Diamonds - Kimberley, South Africa",
  alternates: { canonical: "/about" },
  description:
    " Lute Diamonds has crafted fine diamond jewellery since 2006 in Kimberley, South Africa, now delivering handcrafted pieces across the UK & Europe.",
  keywords: [
    "Diamond Jewellery", "Tanzanite Jewellery",
  ],
}

export default function AboutPage() {
  return (
    <>
      <AboutBanner />
      <StorySection />
      <SignatureSparkleSection />
      <FinishingTouchSection
        heading="The Finishing Touch – Better Things in a Better Way"
        subheading="Our collections feature handcrafted jewellery, uniting elegance, artistry, and brilliance with timeless sophistication and distinctive themes."
        items={[
          {
            image: "/category1.jpeg",
            category: "Rings",
            title: "One-Of-A-Kinds",
            description: "Featuring unique and hand-sourced gemstones from all over the world.",
            buttonLink: "/product-category/wedding-rings",
          },
          {
            image: "/home/pendant-category.png",
            category: "Pendants",
            title: "High Tide Looks",
            description: "Featuring unique and hand-sourced gemstones from all over the world.",
            buttonLink: "/product-category/pendants",
          },
          {
            image: "/home/earring-category.png",
            category: "Earrings",
            title: "New Organic Dôme",
            description: "From solid gold staples to diamond jewelry, browse our most-loved pieces.",
            buttonLink: "/product-category/earrings",
          },
          {
            image: "/home/test2.jpeg",
            category: "Rings",
            title: "The Tiffany Icons",
            description: "The Flora Necklace is a symbol of serenity, and alignment with the pace of nature.",
            buttonLink: "/product-category/wedding-rings",
          },
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
      <TeamSection/>
      <GalleryStrip />
    </>
  );
}
