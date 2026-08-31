"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { formatZAR } from "@/lib/format";
import Breadcrumbs from "@/components/Breadcrumbs";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  country: "South Africa",
};

export default function CheckoutClient() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paygate, setPaygate] = useState(null);
  const formRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (paygate && formRef.current) {
      formRef.current.submit();
    }
  }, [paygate]);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  // Shipping is free storewide — no threshold, no flat fee.
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.productId,
            name: i.name,
            price: i.price,
            qty: i.qty,
            image: i.image,
          })),
          shippingAddress: form,
        }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || "Could not place order");

      const payRes = await fetch("/api/paygate/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id }),
      });
      const payData = await payRes.json();
      if (!payRes.ok) throw new Error(payData.error || "Could not start payment");

      clear();
      setPaygate(payData);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (items.length === 0 && !paygate) {
    return (
      <div className="container-lute py-20 text-center">
        <p className="text-muted mb-6">Your cart is empty.</p>
        <Link href="/shop" className="btn-gold px-6 py-3 rounded text-sm">
          Return to shop
        </Link>
      </div>
    );
  }

  return (
    <div className=" pb-20">
      <Breadcrumbs items={[{ label: "Checkout" }]} />

      <div className="grid md:grid-cols-[1fr_360px] gap-12 container-lute mt-20">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-serif text-xl mb-2">Shipping Details</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} required />
          </div>
          <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
            <Field label="Province" value={form.province} onChange={(v) => setForm({ ...form, province: v })} required />
            <Field label="Postal Code" value={form.postalCode} onChange={(v) => setForm({ ...form, postalCode: v })} required />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-gold w-full py-3 rounded text-sm mt-4">
            {submitting ? "Redirecting to PayGate..." : "Pay with PayGate"}
          </button>
        </form>

        <div className="border border-border rounded-lg p-6 h-fit">
          <h2 className="font-serif text-xl mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>
                  {item.name} &times; {item.qty}
                </span>
                <span>{formatZAR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm py-2 border-t border-border">
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
        </div>
      </div>

      {paygate && (
        <form ref={formRef} action={paygate.actionUrl} method="POST" className="hidden">
          {Object.entries(paygate.fields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded px-3 py-2 text-sm"
      />
    </div>
  );
}
