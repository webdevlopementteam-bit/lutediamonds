"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { formatZAR } from "@/lib/format";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  // Shipping is free storewide — no threshold, no flat fee.
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  return (
    <div className=" pb-20">
      <Breadcrumbs items={[{ label: "Cart" }]} />

      {items.length === 0 ? (
        <div className="py-16 text-center container-lute">
          <p className="text-muted mb-6">Your cart is currently empty.</p>
          <Link href="/shop" className="btn-gold px-6 py-3 rounded text-sm">
            Return to shop
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_320px] gap-12 container-lute mt-20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="py-3">Product</th>
                <th className="py-3">Price</th>
                <th className="py-3">Quantity</th>
                <th className="py-3">Subtotal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productId} className="border-b border-border">
                  <td className="py-4">
                    <Link href={`/product/${item.slug}`} className="flex items-center gap-3">
                      <div className="w-16 h-16 relative bg-gold-light rounded overflow-hidden shrink-0">
                        {item.image && <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />}
                      </div>
                      <span className="hover:text-gold">{item.name}</span>
                    </Link>
                  </td>
                  <td className="py-4">{formatZAR(item.price)}</td>
                  <td className="py-4">
                    <div className="flex items-center border border-border rounded w-fit">
                      <button
                        className="w-8 h-8"
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button
                        className="w-8 h-8"
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4">{formatZAR(item.price * item.qty)}</td>
                  <td className="py-4">
                    <button onClick={() => removeItem(item.productId)} className="text-muted hover:text-red-600">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border border-border rounded-lg p-6 h-fit">
            <h2 className="font-serif text-xl mb-4">Cart Totals</h2>
            <div className="flex justify-between text-sm py-2 border-b border-border">
              <span>Subtotal</span>
              <span>{formatZAR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-border">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "Free" : formatZAR(shippingFee)}</span>
            </div>
            <div className="flex justify-between font-medium py-3">
              <span>Total</span>
              <span className="font-serif text-lg">{formatZAR(total)}</span>
            </div>
            <Link href="/checkout" className="btn-gold w-full text-center block py-3 rounded text-sm mt-4">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
