"use client";

import React, { useState } from "react";
import Script from "next/script";

const faqs = [
  {
    q: "What is Tanzanite jewellery?",
    a: "Tanzanite jewellery features a rare blue-violet gemstone found only near Mount Kilimanjaro in Tanzania. It is set in rings, earrings, bracelets and pendants, often paired with gold or diamonds for a luxurious finish.",
  },
  {
    q: "Is Tanzanite more valuable than diamond?",
    a: "Tanzanite is rarer than diamond due to its single-source location, but diamonds generally hold higher long-term resale value. Many customers choose Tanzanite for its unique colour and rarity rather than investment value.",
  },
  {
    q: "Does Lute Diamonds ship Tanzanite jewellery to the UK and Europe?",
    a: "Yes, Lute Diamonds ships certified Tanzanite jewellery across the United Kingdom and Europe with secure, tracked delivery.",
  },
  {
    q: "How do I know if Tanzanite jewellery is genuine?",
    a: "Genuine Tanzanite jewellery comes with an authenticity certificate from a recognised gemological laboratory, confirming the stone's origin, colour grade and carat weight.",
  },
  {
    q: "What is the best metal to pair with Tanzanite?",
    a: "Tanzanite pairs well with white gold and platinum, which enhance its blue-violet tone, though yellow gold is also popular for a warmer, vintage look.",
  },
  {
    q: "How much does Tanzanite jewellery cost in the UK?",
    a: "Prices vary based on carat weight, cut, clarity and metal type, typically ranging from a few hundred to several thousand pounds for fine, certified pieces.",
  },
  {
    q: "Can Tanzanite be used in engagement rings?",
    a: "Yes, Tanzanite is increasingly popular for engagement rings as a unique alternative to traditional diamond rings, symbolising individuality and rarity.",
  },
  {
    q: "How do I care for Tanzanite jewellery?",
    a: "Tanzanite is a softer gemstone, so it should be stored separately, cleaned with mild soap and water, and protected from hard knocks or extreme temperature changes.",
  },
  {
    q: "What makes Lute Diamonds' Tanzanite jewellery different?",
    a: "Lute Diamonds has handcrafted fine jewellery since 2006, combining certified Tanzanite gemstones with ethically sourced precious metals for lasting quality and design.",
  },
  {
    q: "Does Tanzanite jewellery come with a warranty or return policy?",
    a: "Yes, Lute Diamonds offers a clear returns and exchange policy on all Tanzanite jewellery purchases, with details available on our Delivery & Returns page.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function TanzaniteFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i);

  return (
    <section className="bg-white py-20 px-6 md:px-12">
      {/* JSON-LD schema */}
      <Script
        id="tanzanite-faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="uppercase tracking-[0.2em] text-xs text-[#b08d57] font-semibold">
            Have Questions?
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1f1f1f] mt-3">
            Tanzanite Jewellery FAQs
          </h2>
        </div>

        <div className="divide-y divide-[#eee]">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="py-5">
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="font-serif text-lg text-[#1f1f1f]">
                    {item.q}
                  </span>
                  <span
                    className={`shrink-0 text-xl text-[#b08d57] transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mt-3"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                  style={{ display: "grid" }}
                >
                  <div className="overflow-hidden">
                    <p className="text-[#666] leading-relaxed pr-8">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}