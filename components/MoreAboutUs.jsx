// components/HeroSection.jsx
"use client";

import Link from "next/link";

export default function MoreAboutUs() {
  return (
    <section className="relative w-full h-[500px] md:h-[700px]">
      {/* Background image */}
      <img
        src="/home/about-us.jpeg"
        alt="about-us"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Overlay content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-white text-3xl md:text-4xl font-medium max-w-2xl leading-tight">
          Certified Tanzanite Jewellery, Handcrafted for the UK & Europe
        </h1>

        <p className="text-white/90 text-sm md:text-base max-w-2xl mt-6 font-semibold leading-relaxed">
          Lute Diamonds brings the rare beauty of Tanzanite to jewellery lovers across the UK and Europe. Since 2006, our artisans have handcrafted certified Tanzanite jewellery — from statement engagement rings to delicate earrings and bracelets — combining ethically sourced precious metals with genuine, certified gemstones. Every piece is designed to celebrate life's most meaningful moments, delivered securely to your door across the United Kingdom and Europe. 
        </p>

        <Link
          href="/about"
          className="text-white text-sm font-bold mt-8 underline underline-offset-4"
        >
          More About Us
        </Link>
      </div>
    </section>
  );
}
