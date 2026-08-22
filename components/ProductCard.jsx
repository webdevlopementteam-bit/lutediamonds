// components/ProductCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatZAR } from "@/lib/format";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import StarRating from "./StarRating";
import { Eye, Heart } from "lucide-react";

export default function ProductCard({ product, initialWishlisted = false }) {
  const addItem = useCartStore((s) => s.addItem);
  const hasSynced = useWishlistStore((s) => s.hasSynced);
  const storeWishlisted = useWishlistStore((s) => s.isWishlisted(product._id));
  const toggleWishlistStore = useWishlistStore((s) => s.toggle);
  const [pending, setPending] = useState(false);

  // Until the global store has synced with the server (see Header.jsx),
  // trust the server-rendered prop so the heart is correct on first paint
  // instead of flashing unselected while that sync is still in flight.
  const wishlisted = hasSynced ? storeWishlisted : initialWishlisted;

  async function toggleWishlist(e) {
    e.preventDefault();
    if (pending) return;
    setPending(true);

    // optimistic update - pehle UI turant change karo
    toggleWishlistStore(product._id);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });

      if (res.status === 401) {
        toggleWishlistStore(product._id); // revert
        window.location.href = "/account/login?next=/wishlist";
        return;
      }

      if (!res.ok) {
        toggleWishlistStore(product._id); // revert on failure
        console.error("Wishlist update failed");
      }
    } catch (err) {
      toggleWishlistStore(product._id); // revert on network error
      console.error(err);
    } finally {
      setPending(false);
    }
  }

  function handleAddToCart(e) {
    e.preventDefault();
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
    });
  }

  return (
    <div className="group relative flex flex-col">
      <div className="relative rounded-lg overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="aspect-[4/3] bg-gold-light relative">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 760px) 50vw, 16vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted text-sm">No image</div>
            )}
          </div>
        </Link>

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={toggleWishlist}
            disabled={pending}
            aria-label="Toggle wishlist"
            className={`w-9 h-9 rounded-full flex cursor-pointer items-center justify-center text-sm shadow ${
              wishlisted ? "bg-gold text-white" : "bg-white text-foreground hover:bg-gray-50"
            }`}
          >
            <Heart className="w-5 h-5" fill={wishlisted ? "currentColor" : "none"} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            aria-label="Quick view"
            className="w-9 h-9 rounded-full bg-white text-foreground flex items-center justify-center text-sm shadow hover:bg-gray-50"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>

        <button
          onClick={handleAddToCart}
          className="absolute left-0 right-0 -bottom-12 cursor-pointer group-hover:bottom-0 bg-white text-foreground text-sm font-medium py-3 border-t border-border transition-all duration-300 pointer-events-none group-hover:pointer-events-auto"
        >
          Add to cart
        </button>
      </div>

      <div className="pt-4 flex flex-col gap-1">
        {product.category?.name && (
          <span className="text-xs uppercase tracking-wide text-muted">{product.category.name}</span>
        )}
        <Link href={`/product/${product.slug}`} className="font-medium leading-snug hover:text-gold">
          {product.name}
        </Link>
        <StarRating value={product.ratingAvg} count={product.ratingCount} />
        <span className="font-serif text-lg mt-1">{formatZAR(product.price)}</span>
      </div>
    </div>
  );
}