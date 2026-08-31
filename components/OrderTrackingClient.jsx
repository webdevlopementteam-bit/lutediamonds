"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatZAR } from "@/lib/format";

export default function OrderTrackingClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" pb-20">
      <Breadcrumbs items={[{ label: "Order Tracking" }]} />
      <p className="text-muted mb-8 container-lute max-w-xl mt-20">Enter your order number and the email used at checkout to view its status.</p>

      <form onSubmit={handleSubmit} className="space-y-4 border border-border rounded-lg p-6 container-lute max-w-xl mt-20">
        <div>
          <label className="block text-sm mb-1">Order Number</label>
          <input
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. LD1A2B3C4D"
            className="w-full border border-border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gold px-6 py-3 rounded text-sm">
          {loading ? "Checking..." : "Track Order"}
        </button>
      </form>

      {result && (
        <div className="mt-8 border border-border rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Order {result.orderNumber}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted">Order Status</p>
              <p className="font-medium capitalize">{result.orderStatus}</p>
            </div>
            <div>
              <p className="text-muted">Payment Status</p>
              <p className="font-medium capitalize">{result.paymentStatus}</p>
            </div>
            <div>
              <p className="text-muted">Placed On</p>
              <p className="font-medium">{new Date(result.createdAt).toLocaleDateString("en-ZA")}</p>
            </div>
            <div>
              <p className="text-muted">Total</p>
              <p className="font-medium">{formatZAR(result.total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
