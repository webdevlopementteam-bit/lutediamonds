"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatZAR } from "@/lib/format";

export default function ThankYouClient() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lute_last_order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <div className="container-lute max-w-xl py-20 text-center">
      <h1 className="font-serif text-3xl mb-4">Thank you for your order!</h1>

      {order ? (
        <>
          <p className="text-muted mb-6">
            Order <span className="text-foreground font-medium">{order.orderNumber}</span> has
            been confirmed. We&apos;ll send you updates as it ships.
          </p>
          <div className="border border-border rounded-lg p-6 text-left mb-8">
            <div className="flex justify-between text-sm py-1">
              <span>Order Status</span>
              <span className="capitalize">{order.orderStatus}</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span>Payment Status</span>
              <span className="capitalize">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between font-medium py-1">
              <span>Total</span>
              <span>{formatZAR(order.total)}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-muted mb-6">Your order has been placed.</p>
      )}

      <div className="flex items-center justify-center gap-4">
        <Link href="/order-tracking" className="btn-gold px-6 py-3 rounded text-sm">
          Track Your Order
        </Link>
        <Link href="/shop" className="border border-border px-6 py-3 rounded text-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
