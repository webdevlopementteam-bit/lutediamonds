"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Sparkles } from "lucide-react";

/* 👇 apne assets ke path yahan change kar lena */
const LOGO_SRC = "/logo.png";
const MENU_PROMO_SRC = "/home/pendants-banner.png";

const MARQUEE_ITEMS = [
  "Shop online with ease",
  "Start shopping now",
  "Handpicked products for you",
  "Premium quality products you can trust",
  "Register to enjoy your first online order",
];

/* ---- mega menu content ---- */
const MEGA_MENU = {
  columns: [
    {
      title: "Jewellery",
      links: [
        { label: "Jewellery", href: "/shop" },
        { label: "Polished Precious Stones", href: "/shop" },
        { label: "Semi-Precious Polished Stones", href: "/shop" },
      ],
    },
    {
      title: "Polished Precious",
      links: [
        { label: "Wedding Rings", href: "/product-category/wedding-rings" },
        { label: "Pendants", href: "/product-category/pendants" },
        { label: "Earrings", href: "/product-category/earrings" },
      ],
    },
  ],
  promo: {
    image: MENU_PROMO_SRC,
    title: "Better Things In a Better Way",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
  },
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories", mega: true },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

/* ---------------- icons ---------------- */

function Sparkle({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0c.5 5.3 1.6 8.2 4.2 9.9L24 12l-7.8 2.1C13.6 15.8 12.5 18.7 12 24c-.5-5.3-1.6-8.2-4.2-9.9L0 12l7.8-2.1C10.4 8.2 11.5 5.3 12 0z" />
    </svg>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const SearchIcon = (p) => (
  <svg {...iconProps} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const BagIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M5.5 8h13l-1 12.5H6.5z" />
    <path d="M9 10V6.8a3 3 0 0 1 6 0V10" />
  </svg>
);

const HeartIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" />
  </svg>
);

const UserIcon = (p) => (
  <svg {...iconProps} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="10" r="3.2" />
    <path d="M6.2 19a6.4 6.4 0 0 1 11.6 0" />
  </svg>
);

const HomeIcon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M4 10.5 12 4l8 6.5V20H4z" />
    <path d="M9.5 20v-5.5h5V20" />
  </svg>
);

const ChevronDown = (p) => (
  <svg {...iconProps} {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

/* ---------------- header ---------------- */

export default function Header() {
  const items = useCartStore((s) => s.items);
  const wishlistIds = useWishlistStore((s) => s.wishlistIds);
  const setWishlistIds = useWishlistStore((s) => s.setWishlistIds);
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user);
        setWishlistIds(d.user?.wishlist || []);
      })
      .catch(() => {});
  }, [pathname, setWishlistIds]);

  useEffect(() => {
    setMenuOpen(false);
    setCatOpen(false);
    setMobileCatOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setCatOpen(false);
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cartCount = mounted ? items.reduce((sum, i) => sum + i.qty, 0) : 0;
  const wishlistCount = mounted ? wishlistIds.length : 0;
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery("");
  };

  const navItemClass = (active) =>
    `whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.05em] transition-colors hover:text-[#BF9A3A] ${
      active ? "text-[#BF9A3A]" : "text-[#1B1B1B]"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        <style>{`
          @keyframes luteMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .lute-marquee__track { display: flex; width: max-content; animation: luteMarquee 42s linear infinite; }
          .lute-marquee:hover .lute-marquee__track { animation-play-state: paused; }
          @keyframes luteFadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
          .lute-mega { animation: luteFadeDown .18s ease-out; }
          @media (prefers-reduced-motion: reduce) {
            .lute-marquee__track, .lute-mega { animation: none; }
          }
          /* bottom nav ke liye mobile pe page ko jagah do */
          @media (max-width: 1023px) { body { padding-bottom: 68px; } }
        `}</style>

        {/* ---------- marquee top bar ---------- */}
        <div className="lute-marquee overflow-hidden bg-[#100F0D] py-2.5">
          <div className="lute-marquee__track">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
                {MARQUEE_ITEMS.map((text) => (
                  <div key={text} className="flex items-center">
                    <span className="whitespace-nowrap px-7 text-[11px] font-bold uppercase tracking-[0.1em] text-white md:px-10 md:text-[13px]">
                      {text}
                    </span>
                    <Sparkles className="h-4 w-4 shrink-0 text-[#C9A227]" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- main bar + mega menu ---------- */}
        <div className="relative border-b border-black/[0.07] bg-white" onMouseLeave={() => setCatOpen(false)}>
          <div className="relative flex h-[80px] w-full items-center justify-between gap-6 px-[30px]">
            {/* left: nav (desktop) */}
            <nav className="hidden items-center gap-5 lg:flex">
              {NAV_LINKS.map((link) =>
                link.mega ? (
                  <button
                    key={link.href}
                    type="button"
                    onMouseEnter={() => setCatOpen(true)}
                    onClick={() => setCatOpen((v) => !v)}
                    aria-expanded={catOpen}
                    className={`flex items-center gap-1 ${navItemClass(catOpen)}`}
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${catOpen ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => setCatOpen(false)}
                    className={navItemClass(isActive(link.href))}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* left: burger (mobile) */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 shrink-0 items-center justify-center text-[#1B1B1B] lg:hidden"
            >
              <svg {...iconProps} className="h-6 w-6">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>

            {/* center: logo (truly centered) */}
            <Link
              href="/"
              aria-label="Lute Diamonds home"
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
            >
              <img src={LOGO_SRC} alt="Lute Diamonds" className="h-10 w-auto md:h-[60px]" />
            </Link>

            {/* right: icons (desktop only — mobile pe bottom bar hai) */}
            <div className="hidden shrink-0 items-center gap-4 text-[#1B1B1B] lg:flex">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                aria-expanded={searchOpen}
                className="transition-colors hover:text-[#BF9A3A]"
              >
                <SearchIcon className="h-[26px] w-[26px]" />
              </button>

              <Link href="/cart" aria-label="Cart" className="relative transition-colors hover:text-[#BF9A3A]">
                <BagIcon className="h-[26px] w-[26px]" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#BF9A3A] px-1 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link href="/wishlist" aria-label="Wishlist" className="relative transition-colors hover:text-[#BF9A3A]">
                <HeartIcon className="h-[26px] w-[26px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#BF9A3A] px-1 text-[10px] font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href={user ? "/account" : "/account/login"}
                title={user ? `Hi, ${user.name.split(" ")[0]}` : "My Account"}
                aria-label={user ? "My account" : "Sign in"}
                className="transition-colors hover:text-[#BF9A3A]"
              >
                <UserIcon className="h-[26px] w-[26px]" />
              </Link>
            </div>

            {/* mobile: sirf search right me */}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="h-9 w-9 shrink-0 text-[#1B1B1B] lg:hidden"
            >
              <SearchIcon className="mx-auto h-[22px] w-[22px]" />
            </button>
          </div>

          {/* ---------- mega dropdown ---------- */}
          {catOpen && (
            <div className="lute-mega absolute left-0 right-0 top-full hidden border-t border-black/[0.07] bg-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)] lg:block">
              <div className="grid w-full grid-cols-[1fr_1fr_1.5fr] gap-10 px-[30px] py-10">
                {MEGA_MENU.columns.map((col) => (
                  <div key={col.title}>
                    <h3 className="text-[20px] font-semibold text-[#1B1B1B]">{col.title}</h3>
                    <ul className="mt-4 space-y-[12px]">
                      {col.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className="text-[16px] text-[#3A3A3A] transition-colors hover:text-[#BF9A3A]">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* promo card */}
                <div className="relative h-[370px] overflow-hidden rounded-xl bg-[#0C2C33]">
                  <img
                    src={MEGA_MENU.promo.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
                  <div className="relative flex h-full flex-col justify-center gap-7 p-12">
                    <h4 className="max-w-[280px] text-[40px] font-medium leading-[1.15] text-white">
                      {MEGA_MENU.promo.title}
                    </h4>
                    <Link
                      href={MEGA_MENU.promo.ctaHref}
                      className="inline-flex w-fit items-center rounded-lg bg-white px-6 py-3 text-[15px] font-semibold text-[#1B1B1B] transition-colors hover:bg-[#F3E9D4]"
                    >
                      {MEGA_MENU.promo.ctaLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* search drawer */}
          {searchOpen && (
            <div className="border-t border-black/[0.07] bg-white">
              <form onSubmit={submitSearch} className="flex w-full items-center gap-3 px-[30px] py-3">
                <SearchIcon className="h-5 w-5 text-[#8A8A8A]" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for rings, necklaces, earrings…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#9A9A9A]"
                />
                <button type="submit" className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#BF9A3A]">
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ---------- mobile menu ---------- */}
        {menuOpen && (
          <nav className="max-h-[70vh] overflow-y-auto border-b border-black/[0.07] bg-white px-[30px] py-4 lg:hidden">
            {NAV_LINKS.map((link) =>
              link.mega ? (
                <div key={link.href} className="border-b border-black/5">
                  <button
                    type="button"
                    onClick={() => setMobileCatOpen((v) => !v)}
                    aria-expanded={mobileCatOpen}
                    className="flex w-full items-center justify-between py-3 text-[14px] font-semibold uppercase tracking-[0.05em]"
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${mobileCatOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileCatOpen && (
                    <div className="pb-3">
                      {MEGA_MENU.columns.map((col) => (
                        <div key={col.title} className="mb-3">
                          <p className="py-1 text-[13px] font-semibold text-[#1B1B1B]">{col.title}</p>
                          {col.links.map((l) => (
                            <Link key={l.href} href={l.href} className="block py-2 pl-3 text-[14px] text-[#4A4A4A]">
                              {l.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block border-b border-black/5 py-3 text-[14px] font-semibold uppercase tracking-[0.05em] ${
                    isActive(link.href) ? "text-[#BF9A3A]" : "text-[#1B1B1B]"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        )}
      </header>

      {/* ---------- mobile bottom nav (fixed) ---------- */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_-12px_rgba(0,0,0,0.35)] lg:hidden"
        aria-label="Quick navigation"
      >
        <ul className="grid grid-cols-5">
          {[
            { href: "/", label: "Home", Icon: HomeIcon },
            { href: "/shop", label: "Shop", Icon: SearchIcon },
            { href: "/wishlist", label: "Wishlist", Icon: HeartIcon, badge: wishlistCount },
            { href: "/cart", label: "Cart", Icon: BagIcon, badge: cartCount },
            {
              href: user ? "/account" : "/account/login",
              label: user ? user.name.split(" ")[0] : "Account",
              Icon: UserIcon,
            },
          ].map(({ href, label, Icon, badge }) => {
            const active = isActive(href);
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`flex flex-col items-center gap-1 py-2.5 transition-colors ${
                    active ? "text-[#BF9A3A]" : "text-[#1B1B1B]"
                  }`}
                >
                  <span className="relative">
                    <Icon className="h-[22px] w-[22px]" />
                    {badge > 0 && (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#BF9A3A] px-1 text-[10px] font-semibold text-white">
                        {badge}
                      </span>
                    )}
                  </span>
                  <span className="max-w-[64px] truncate text-[10px] font-medium">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}