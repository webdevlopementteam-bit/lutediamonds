import React from "react";

const collections = [
  {
    title: "Tanzanite Engagement Rings",
    desc: "A rare alternative to traditional diamonds, symbolising individuality and timeless love.",
    link: "/product-category/wedding-rings",
  },
  {
    title: "Tanzanite Earrings",
    desc: "Lightweight, elegant, and perfect for everyday wear or special occasions.",
    link: "/product-category/earrings",
  },
  {
    title: "Tanzanite Bracelets",
    desc: "Handcrafted designs that add a graceful sparkle to any outfit.",
    link: "/shop",
  },
  {
    title: "Tanzanite Jewellery Sets",
    desc: "Matching rings, earrings and pendants curated for a complete look.",
    link: "/shop",
  },
  {
    title: "Women's Tanzanite Jewellery",
    desc: "Thoughtfully designed pieces celebrating individuality and grace.",
    link: "/shop",
  },
];

const trustPoints = [
  "Certified & Authenticated Tanzanite",
  "Shipping Across UK & Europe",
  "Secure Checkout & Flexible Payments",
  "Ethically Sourced Since 2006",
];

export default function WhyChooseTanzanite() {
  return (
    <section className="bg-[#faf7f2] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Intro */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1f1f1f] mt-3 mb-5 leading-tight">
             Why Choose Lute Diamonds for Certified Tanzanite Jewellery in UK
            </h2>
            <p className="text-[#555] leading-relaxed mb-6">
             Tanzanite is one of the rarest gemstones on earth, found only in a single region near Mount Kilimanjaro. At Lute Diamonds, every Tanzanite Jewellery piece comes with authenticity certification, so customers across the UK and Europe can shop with complete confidence. Our collection blends timeless craftsmanship with modern design, making each piece a true keepsake.
            </p>
          </div>

          <div className="relative">
            <img
              src="/home/test4.jpeg"
              alt="Certified Tanzanite Jewellery"
              className="w-full h-[420px] object-cover"
            />
          </div>
        </div>

        {/* Collection grid */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl text-[#1f1f1f] mb-8 text-center">
            Shop Our Tanzanite Collection
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {collections.map((item) => (
              <a
                key={item.title}
                href={item.link}
                className="group block bg-white border border-[#eee] p-6 text-center hover:border-[#b08d57] transition-colors duration-300"
              >
                <h4 className="font-serif text-lg text-[#1f1f1f] mb-2 group-hover:text-[#b08d57] transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-[#777] leading-relaxed">
                  {item.desc}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="bg-[#1f1f1f] text-white px-6 md:px-12 py-10">
          <h3 className="font-serif text-xl md:text-2xl mb-6 text-center">
            Trusted Across the UK &amp; Europe
          </h3>
          <p className="text-center text-[#ccc] max-w-3xl mx-auto mb-8 leading-relaxed">
            We proudly ship certified Tanzanite jewellery to customers throughout the United Kingdom and Europe, backed by secure checkout, flexible payment options, and dedicated customer support. Each purchase reflects our commitment to ethical sourcing, fine craftsmanship, and lasting quality — a tradition Lute Diamonds has upheld for nearly two decades.
          </p>
          <p className="text-center text-[#ccc] max-w-3xl mx-auto mb-8 leading-relaxed font-bold italic">Explore our certified Tanzanite jewellery collection today and discover a piece that tells your story.</p>
        </div>
      </div>
    </section>
  );
}