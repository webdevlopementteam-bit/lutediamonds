// app/account/orders/[id]/page.jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatZAR } from "@/lib/format";
import { resolvePendingPayment } from "@/lib/resolvePayment";

const ArrowIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

const PinIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

function statusStyle(status = "") {
  const s = status.toLowerCase();
  if (["delivered", "completed", "paid"].includes(s)) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (["shipped", "dispatched"].includes(s)) return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (["processing", "confirmed"].includes(s)) return "bg-blue-50 text-blue-700 border-blue-200";
  if (["cancelled", "canceled", "failed", "refunded", "unpaid"].includes(s)) return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

function Badge({ label, value }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.09em] text-[#8A8A8A]">
        {label}
      </p>
      <span
        className={`mt-2 inline-block rounded-full border px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.05em] ${statusStyle(value)}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const session = await getCurrentUser();
  await connectDB();
  let order = await Order.findById(id).lean();
  if (!order || order.user?.toString() !== session.sub) notFound();
  order = await resolvePendingPayment(order);

  const addr = order.shippingAddress || {};
  const placedOn = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="pb-20">
      <div>
        <Breadcrumbs
          items={[
            { label: "My Account", href: "/account" },
            { label: "Orders", href: "/account/orders" },
            { label: order.orderNumber },
          ]}
        />
      </div>

      <div className="container-lute mt-8 max-w-5xl">
        {/* ---------- header ---------- */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#6B6B6B] transition-colors hover:text-[#BF9A3A]"
        >
          <ArrowIcon className="h-4 w-4" />
          All orders
        </Link>

        <h1 className="mt-4 text-[26px] font-medium leading-tight tracking-[-0.01em] text-[#141414] sm:text-[32px]">
          Order {order.orderNumber}
        </h1>
        {placedOn && (
          <p className="mt-2 text-[15px] text-[#6B6B6B]">Placed on {placedOn}</p>
        )}

        {/* ---------- status ---------- */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Badge label="Order Status" value={order.orderStatus} />
          <Badge label="Payment Status" value={order.paymentStatus} />
        </div>

        {/* ---------- body ---------- */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-6">
            {/* items */}
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="border-b border-black/[0.07] bg-[#FAF8F4] px-5 py-4 sm:px-6">
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.09em] text-[#8A8A8A]">
                  Items ({order.items?.length || 0})
                </h2>
              </div>

              <ul className="divide-y divide-black/[0.07]">
                {order.items?.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 px-5 py-5 sm:px-6">
                    {item.image && (
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F1ECE2]">
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium leading-snug text-[#141414]">
                        {item.name}
                      </p>
                      <p className="mt-1.5 text-[13.5px] text-[#8A8A8A]">
                        {item.qty} &times; {formatZAR(item.price)}
                      </p>
                    </div>

                    <p className="shrink-0 text-[15px] font-medium text-[#141414]">
                      {formatZAR(item.price * item.qty)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* shipping address */}
            <div className="rounded-2xl border border-black/10 p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F1E5] text-[#BF9A3A]">
                  <PinIcon className="h-[18px] w-[18px]" />
                </span>
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.09em] text-[#8A8A8A]">
                  Shipping Address
                </h2>
              </div>

              <div className="mt-4 space-y-1 text-[15px] leading-[1.7] text-[#5A5A5A]">
                <p className="font-medium text-[#141414]">{addr.fullName}</p>
                {addr.address && <p>{addr.address}</p>}
                <p>
                  {[addr.city, addr.province, addr.postalCode].filter(Boolean).join(", ")}
                </p>
                {addr.country && <p>{addr.country}</p>}
              </div>
            </div>
          </div>

          {/* ---------- summary ---------- */}
          <aside className="rounded-2xl border border-black/10 bg-[#FAF8F4] p-6 lg:sticky lg:top-32">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.09em] text-[#8A8A8A]">
              Summary
            </h2>

            <dl className="mt-5 space-y-3 text-[15px]">
              <div className="flex items-center justify-between">
                <dt className="text-[#5A5A5A]">Subtotal</dt>
                <dd className="text-[#141414]">{formatZAR(order.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#5A5A5A]">Shipping</dt>
                <dd className={order.shippingFee ? "text-[#141414]" : "text-emerald-600"}>
                  {order.shippingFee ? formatZAR(order.shippingFee) : "Free"}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-black/10 pt-5">
              <span className="text-[15px] font-medium text-[#141414]">Total</span>
              <span className="text-[22px] font-medium text-[#141414]">{formatZAR(order.total)}</span>
            </div>

            <Link
              href="/shop"
              className="mt-6 block rounded-lg bg-[#141414] py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#BF9A3A]"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}