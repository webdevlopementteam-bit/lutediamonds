// app/account/page.jsx
import Link from "next/link";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { getWishlistIds } from "@/lib/wishlist";
import LogoutButton from "@/components/LogoutButton";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  alternates: { canonical: "/account" },
};

const BoxIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M21 8.5 12 3.5 3 8.5v7L12 20.5l9-5z" />
    <path d="M3 8.5 12 13.5l9-5M12 13.5v7" />
  </svg>
);

const HeartIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" />
  </svg>
);

const BagIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5.5 8h13l-1 12.5H6.5z" />
    <path d="M9 10V6.8a3 3 0 0 1 6 0V10" />
  </svg>
);

const ArrowIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const QUICK_LINKS = [
  { href: "/account/orders", label: "Order History", desc: "Track and review past orders", Icon: BoxIcon },
  { href: "/wishlist", label: "Wishlist", desc: "Pieces you've saved for later", Icon: HeartIcon },
  { href: "/shop", label: "Continue Shopping", desc: "Browse the full collection", Icon: BagIcon },
];

export default async function AccountDashboard() {
  const session = await getCurrentUser();
  await connectDB();

  const [user, orderCount, wishlistIds] = await Promise.all([
    User.findById(session.sub).select("name email createdAt").lean(),
    Order.countDocuments({ user: session.sub }),
    getWishlistIds(),
  ]);

  const name = user?.name || "there";
  const firstName = name.split(" ")[0];
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  const STATS = [
    { label: "Orders placed", value: orderCount, href: "/account/orders", cta: "View order history" },
    { label: "Saved pieces", value: wishlistIds?.length ?? 0, href: "/wishlist", cta: "View wishlist" },
    { label: "Member since", value: memberSince, href: null, cta: null },
  ];

  return (
    <div className="pb-20">
      <div>
        <Breadcrumbs items={[{ label: "My Account" }]} />
      </div>

      {/* ---------- welcome card ---------- */}
      <div className="container-lute mt-8">
        <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-r from-[#141414] to-[#2C2418] p-7 text-white sm:flex-row sm:items-center sm:justify-between md:p-10">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#DBAF36]/40 bg-[#DBAF36]/15 text-[20px] font-semibold text-[#DBAF36]">
              {initials(name) || "LD"}
            </div>
            <div className="min-w-0">
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#DBAF36]">
                My Account
              </p>
              <h1 className="mt-1.5 truncate text-[24px] font-medium leading-tight md:text-[30px]">
                Hi, {firstName}
              </h1>
              <p className="mt-1 truncate text-[14.5px] text-white/60">{user?.email}</p>
            </div>
          </div>

          <LogoutButton
            endpoint="/api/auth/logout"
            redirectTo="/"
            className="shrink-0 self-start rounded-lg border border-white/20 px-5 py-2.5 text-[14px] font-medium text-white/80 transition-colors hover:border-[#DBAF36] hover:text-[#DBAF36] sm:self-auto"
          />
        </div>
      </div>

      {/* ---------- stats ---------- */}
      <div className="container-lute mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-black/10 bg-white p-6 transition-colors hover:border-[#BF9A3A]/50"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8A8A8A]">
              {s.label}
            </p>
            <p className="mt-3 text-[30px] font-medium leading-none text-[#141414]">{s.value}</p>
            {s.href && (
              <Link
                href={s.href}
                className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#BF9A3A] transition-colors hover:text-[#A8862C]"
              >
                {s.cta}
                <ArrowIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* ---------- quick links ---------- */}
      <div className="container-lute mt-10">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A]">
          Quick links
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map(({ href, label, desc, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 rounded-2xl border border-black/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#BF9A3A]/50 hover:shadow-[0_12px_28px_-20px_rgba(0,0,0,0.45)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7F1E5] text-[#BF9A3A]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[15.5px] font-medium text-[#141414] transition-colors group-hover:text-[#BF9A3A]">
                  {label}
                </span>
                <span className="mt-1 block text-[13.5px] leading-relaxed text-[#6B6B6B]">
                  {desc}
                </span>
              </span>
              <ArrowIcon className="ml-auto mt-1 h-4 w-4 shrink-0 text-[#C4C4C4] transition-all group-hover:translate-x-0.5 group-hover:text-[#BF9A3A]" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}