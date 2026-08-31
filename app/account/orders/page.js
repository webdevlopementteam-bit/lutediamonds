// app/account/orders/page.jsx
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatZAR } from "@/lib/format";

export const metadata = {
  alternates: { canonical: "/account/orders" },
};

const ArrowIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const BoxIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M21 8.5 12 3.5 3 8.5v7L12 20.5l9-5z" />
    <path d="M3 8.5 12 13.5l9-5M12 13.5v7" />
  </svg>
);

/* status ke hisaab se badge ka rang */
function statusStyle(status = "") {
  const s = status.toLowerCase();
  if (["delivered", "completed"].includes(s)) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (["shipped", "dispatched"].includes(s)) return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (["processing", "confirmed", "paid"].includes(s)) return "bg-blue-50 text-blue-700 border-blue-200";
  if (["cancelled", "canceled", "failed", "refunded"].includes(s)) return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200"; // pending etc.
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function OrderHistoryPage() {
  const session = await getCurrentUser();
  await connectDB();
  const orders = await Order.find({ user: session.sub }).sort({ createdAt: -1 }).lean();

  return (
    <div className="pb-20">
      <div>
        <Breadcrumbs items={[{ label: "My Account", href: "/account" }, { label: "Orders" }]} />
      </div>

      <div className="container-lute mt-8 max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-medium leading-tight tracking-[-0.01em] text-[#141414] sm:text-[32px]">
              Order History
            </h1>
            <p className="mt-2 text-[15px] text-[#6B6B6B]">
              {orders.length === 0
                ? "Your past orders will appear here."
                : `${orders.length} order${orders.length > 1 ? "s" : ""} placed`}
            </p>
          </div>
          <Link
            href="/account"
            className="text-[14px] font-medium text-[#BF9A3A] transition-colors hover:text-[#A8862C]"
          >
            Back to account
          </Link>
        </div>

        {orders.length === 0 ? (
          /* ---------- empty ---------- */
          <div className="mt-10 rounded-2xl border border-dashed border-black/15 bg-[#FAF8F4] px-6 py-16 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E8D5] text-[#BF9A3A]">
              <BoxIcon className="h-7 w-7" />
            </span>
            <p className="mt-5 text-[17px] font-medium text-[#141414]">No orders yet</p>
            <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-[#6B6B6B]">
              When you place your first order it will show up here with its status and receipt.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-lg bg-[#141414] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#BF9A3A]"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            {/* ---------- mobile: cards ---------- */}
            <div className="mt-8 space-y-4 md:hidden">
              {orders.map((o) => (
                <Link
                  key={String(o._id)}
                  href={`/account/orders/${o._id}`}
                  className="block rounded-2xl border border-black/10 bg-white p-5 transition-colors active:border-[#BF9A3A]/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[15.5px] font-medium text-[#141414]">
                        {o.orderNumber}
                      </p>
                      <p className="mt-1 text-[13px] text-[#8A8A8A]">{formatDate(o.createdAt)}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.05em] ${statusStyle(o.orderStatus)}`}
                    >
                      {o.orderStatus}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-black/[0.07] pt-4">
                    <span className="text-[17px] font-medium text-[#141414]">
                      {formatZAR(o.total)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#BF9A3A]">
                      View order
                      <ArrowIcon className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* ---------- desktop: table ---------- */}
            <div className="mt-8 hidden overflow-hidden rounded-2xl border border-black/10 md:block">
              <table className="w-full text-[14.5px]">
                <thead>
                  <tr className="bg-[#FAF8F4] text-left">
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">Order</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">Date</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">Status</th>
                    <th className="px-6 py-4 text-right text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8A8A8A]">Total</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.07]">
                  {orders.map((o) => (
                    <tr key={String(o._id)} className="group transition-colors hover:bg-[#FCFAF6]">
                      <td className="px-6 py-4 font-medium text-[#141414]">{o.orderNumber}</td>
                      <td className="px-6 py-4 text-[#5A5A5A]">{formatDate(o.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full border px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.05em] ${statusStyle(o.orderStatus)}`}
                        >
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-[#141414]">
                        {formatZAR(o.total)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/account/orders/${o._id}`}
                          className="inline-flex items-center gap-1.5 font-medium text-[#BF9A3A] transition-colors hover:text-[#A8862C]"
                        >
                          View
                          <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}