// components/ProductGallery.jsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const LeftIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M14 6l-6 6 6 6" />
  </svg>
);
const RightIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M10 6l6 6-6 6" />
  </svg>
);

export default function ProductGallery({ images = [], name, alt }) {
  const altText = alt || name;
  const [active, setActive] = useState(0);
  const startX = useRef(null);

  const hasImages = images.length > 0;
  const many = images.length > 1;

  useEffect(() => {
    setActive(0);
  }, [images]);

  const go = (dir) => setActive((i) => (i + dir + images.length) % images.length);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-5">
      <style>{`
        .pg-rail { scrollbar-width: none; -ms-overflow-style: none; }
        .pg-rail::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ---------- thumbnail rail ---------- */}
      {many && (
        <div className="pg-rail flex shrink-0 gap-3 overflow-x-auto pb-1 md:max-h-[560px] md:w-[74px] md:flex-col md:overflow-y-auto md:pb-0">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square w-[64px] shrink-0 overflow-hidden rounded-lg bg-[#F4F1EB] transition-all md:w-full ${
                i === active
                  ? "ring-2 ring-[#BF9A3A] ring-offset-2 ring-offset-white"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="" fill sizes="74px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ---------- main image ---------- */}
      <div
        className="group relative aspect-square min-w-0 flex-1 overflow-hidden rounded-2xl bg-[#F4F1EB]"
        onKeyDown={(e) => {
          if (!many) return;
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (!many || startX.current === null) return;
          const dx = e.changedTouches[0].clientX - startX.current;
          if (dx < -40) go(1);
          if (dx > 40) go(-1);
          startX.current = null;
        }}
        tabIndex={many ? 0 : -1}
        role={many ? "group" : undefined}
        aria-label={many ? `${name} images` : undefined}
      >
        {hasImages ? (
          <Image
            key={images[active]}
            src={images[active]}
            alt={`${altText} — image ${active + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[15px] text-[#9A9A9A]">
            No image
          </div>
        )}

        {many && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#141414] shadow-sm backdrop-blur transition-all hover:bg-white md:opacity-0 md:group-hover:opacity-100"
            >
              <LeftIcon className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#141414] shadow-sm backdrop-blur transition-all hover:bg-white md:opacity-0 md:group-hover:opacity-100"
            >
              <RightIcon className="h-[18px] w-[18px]" />
            </button>

            {/* dots — mobile */}
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 md:hidden">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-4 bg-[#BF9A3A]" : "w-1.5 bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}