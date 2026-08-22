// app/admin/orders/[id]/page.jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { formatZAR } from "@/lib/format";
import OrderStatusForm from "@/components/admin/OrderStatusForm";
import { resolvePendingPayment } from "@/lib/resolvePayment";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const BackIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
const UserIcon = (p) => (
  <svg {...iconProps} {...p}>
    <circle cx="12" cy="9" r="3.4" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </svg>
);
const PinIcon = (p) => (
  <svg {...iconProps} {...p}>
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

function Card({ title, icon, children }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white">
      {title && (
        <div className="flex items-center gap-2.5 border-b border-black/[0.07] bg-[#FAF8F4] px-5 py-4 sm:px-6">
          {icon}
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.09em] text-[#8A8A8A]">
            {title}
          </h2>
        </div>
      )}
      {children}
    </section>
  );
}

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  await connectDB();
  let order = await Order.findById(id).lean();
  if (!order) notFound();
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
    <div className="pb-12">
      {/* ---------- header ---------- */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#6B6B6B] transition-colors hover:text-[#BF9A3A]"
      >
        <BackIcon className="h-4 w-4" />
        All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
        <h1 className="text-[24px] font-medium leading-tight tracking-[-0.01em] text-[#141414] sm:text-[30px]">
          Order {order.orderNumber}
        </h1>
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.05em] ${statusStyle(order.orderStatus)}`}
          >
            {order.orderStatus}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.05em] ${statusStyle(order.paymentStatus)}`}
          >
            {order.paymentStatus}
          </span>
        </div>
      </div>
      {placedOn && <p className="mt-2 text-[15px] text-[#6B6B6B]">Placed on {placedOn}</p>}

      {/* ---------- body ---------- */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_330px] xl:items-start">
        <div className="min-w-0 space-y-6">
          {/* items */}
          <Card title={`Items (${order.items?.length || 0})`}>
            <ul className="divide-y divide-black/[0.07]">
              {order.items?.map((item, i) => (
                <li key={i} className="flex items-start gap-4 px-5 py-4 sm:px-6">
                  {item.image && (
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F1ECE2]">
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium leading-snug text-[#141414]">{item.name}</p>
                    <p className="mt-1 text-[13.5px] text-[#8A8A8A]">
                      {item.qty} &times; {formatZAR(item.price)}
                    </p>
                  </div>
                  <p className="shrink-0 text-[15px] font-medium text-[#141414]">
                    {formatZAR(item.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>

            {/* totals */}
            <div className="space-y-2.5 border-t border-black/[0.07] bg-[#FCFAF6] px-5 py-4 text-[14.5px] sm:px-6">
              <div className="flex justify-between">
                <span className="text-[#5A5A5A]">Subtotal</span>
                <span className="text-[#141414]">{formatZAR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A5A5A]">Shipping</span>
                <span className={order.shippingFee ? "text-[#141414]" : "text-emerald-600"}>
                  {order.shippingFee ? formatZAR(order.shippingFee) : "Free"}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-black/10 pt-3">
                <span className="font-medium text-[#141414]">Total</span>
                <span className="text-[20px] font-medium text-[#141414]">
                  {formatZAR(order.total)}
                </span>
              </div>
            </div>
          </Card>

          {/* customer + address */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card
              title="Customer"
              icon={
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1E8D5] text-[#BF9A3A]">
                  <UserIcon className="h-4 w-4" />
                </span>
              }
            >
              <div className="space-y-1.5 px-5 py-5 text-[14.5px] leading-[1.7] sm:px-6">
                <p className="font-medium text-[#141414]">{addr.fullName || "—"}</p>
                {addr.email && (
                  <a
                    href={`mailto:${addr.email}`}
                    className="block break-words text-[#5A5A5A] transition-colors hover:text-[#BF9A3A]"
                  >
                    {addr.email}
                  </a>
                )}
                {addr.phone && (
                  <a
                    href={`tel:${addr.phone}`}
                    className="block text-[#5A5A5A] transition-colors hover:text-[#BF9A3A]"
                  >
                    {addr.phone}
                  </a>
                )}
              </div>
            </Card>

            <Card
              title="Shipping Address"
              icon={
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1E8D5] text-[#BF9A3A]">
                  <PinIcon className="h-4 w-4" />
                </span>
              }
            >
              <div className="space-y-1 px-5 py-5 text-[14.5px] leading-[1.7] text-[#5A5A5A] sm:px-6">
                {addr.address && <p>{addr.address}</p>}
                <p>{[addr.city, addr.province, addr.postalCode].filter(Boolean).join(", ")}</p>
                {addr.country && <p>{addr.country}</p>}
              </div>
            </Card>
          </div>
        </div>

        {/* ---------- status form ---------- */}
        <aside className="xl:sticky xl:top-32">
          <OrderStatusForm order={JSON.parse(JSON.stringify(order))} />
        </aside>
      </div>
    </div>
  );
}