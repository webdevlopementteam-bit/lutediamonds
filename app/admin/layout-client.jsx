// app/admin/layout.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const GridIcon = (p) => (
  <svg {...iconProps} {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);
const BoxIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M21 8.5 12 3.5 3 8.5v7L12 20.5l9-5z" />
    <path d="M3 8.5 12 13.5l9-5M12 13.5v7" />
  </svg>
);
const TagIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M3.5 10.5V4.5h6l10 10-6 6z" />
    <circle cx="7.5" cy="8.5" r="1.3" />
  </svg>
);
const LayersIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M12 3.5 3 8l9 4.5L21 8z" />
    <path d="M3 12.5 12 17l9-4.5M3 16.5 12 21l9-4.5" />
  </svg>
);
const DocIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M14 3.5H7a1.5 1.5 0 0 0-1.5 1.5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8z" />
    <path d="M14 3.5V8h4.5M8.5 12.5h7M8.5 16h4.5" />
  </svg>
);

const LINKS = [
  { href: "/admin", label: "Dashboard", Icon: GridIcon },
  { href: "/admin/orders", label: "Orders", Icon: BoxIcon },
  { href: "/admin/products", label: "Products", Icon: TagIcon },
  { href: "/admin/categories", label: "Categories", Icon: LayersIcon },
  { href: "/admin/blog", label: "Blog", Icon: DocIcon },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return children;

  const isActive = (href) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="container-lute py-6 lg:py-10">
      <style>{`
        .admin-tabs { scrollbar-width: none; -ms-overflow-style: none; }
        .admin-tabs::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ---------- mobile / tablet: pill tabs ---------- */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[20px] font-medium text-[#141414]">Admin Panel</h2>
          <LogoutButton
            endpoint="/api/admin/auth/logout"
            redirectTo="/admin/login"
            className="shrink-0 rounded-lg border border-black/10 px-3.5 py-2 text-[13px] font-medium text-[#6B6B6B] transition-colors hover:border-[#BF9A3A] hover:text-[#BF9A3A]"
          />
        </div>

        <nav className="admin-tabs -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {LINKS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-medium transition-colors ${
                  active
                    ? "bg-[#141414] text-white"
                    : "border border-black/10 bg-white text-[#5A5A5A] hover:border-[#BF9A3A]/60 hover:text-[#BF9A3A]"
                }`}
              >
                <Icon className="h-[17px] w-[17px]" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ---------- layout ---------- */}
      <div className="mt-6 grid gap-8 lg:mt-0 lg:grid-cols-[236px_1fr] lg:gap-10">
        {/* desktop sidebar */}
        <aside className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-[#141414] to-[#221C12] p-5">
            <div className="px-2 pb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#DBAF36]">
                Lute Diamonds
              </p>
              <h2 className="mt-1.5 text-[18px] font-medium text-white">Admin Panel</h2>
            </div>

            <nav className="flex flex-col gap-1 border-t border-white/10 pt-4">
              {LINKS.map(({ href, label, Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14.5px] transition-colors ${
                      active
                        ? "bg-[#DBAF36]/15 font-medium text-[#DBAF36]"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-[#DBAF36]" />
                    )}
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-white/10 pt-4">
              <LogoutButton
                endpoint="/api/admin/auth/logout"
                redirectTo="/admin/login"
                className="block w-full rounded-lg px-3 py-2.5 text-left text-[14.5px] text-white/50 transition-colors hover:bg-white/5 hover:text-[#DBAF36]"
              />
            </div>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}