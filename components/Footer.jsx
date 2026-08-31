// components/Footer.jsx
import Link from "next/link";

const LOGO_SRC = "/logo.png";
const GOLD = "#DBAF36";

const BRAND_TEXT =
  "Since 2006, Lute Diamonds (Pty) Ltd has crafted exclusively styled diamonds, combining fine workmanship with timeless elegance to satisfy discerning local and international clients.";

const SHOP_LINKS = [
  { href: "/product-category/wedding-rings", label: "Wedding Rings" },
  { href: "/product-category/pendants", label: "Pendants" },
  { href: "/product-category/earrings", label: "Earrings" },
];

const CATEGORY_LINKS = [
  { href: "/shop", label: "Jewellery" },
  { href: "/shop", label: "Polished Precious Stones" },
  { href: "/shop", label: "Semi-Precious Polished Stones" },
];

const INFO_LINKS = [
  { href: "/delivery-returns", label: "Delivery & Returns" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact Us" },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Lute-Diamonds/61592089116019/",
    path: "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.41-.12-2.38 0-4.01 1.45-4.01 4.13v2.29H7.5V13h2.78v8z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lutediamonds/",
    path: "M12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8m0 1.8a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2M16.9 6a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2M8.4 3h7.2A5.4 5.4 0 0 1 21 8.4v7.2a5.4 5.4 0 0 1-5.4 5.4H8.4A5.4 5.4 0 0 1 3 15.6V8.4A5.4 5.4 0 0 1 8.4 3m0 1.9A3.5 3.5 0 0 0 4.9 8.4v7.2a3.5 3.5 0 0 0 3.5 3.5h7.2a3.5 3.5 0 0 0 3.5-3.5V8.4a3.5 3.5 0 0 0-3.5-3.5z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/lutediamonds/",
    path: "M6.94 8.5H4.1V20h2.84zM5.52 3.9a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3M20 13.6c0-3.05-1.63-4.47-3.8-4.47-1.75 0-2.54.96-2.98 1.64V8.5h-2.84c.04.8 0 11.5 0 11.5h2.84v-6.42c0-.26.02-.51.09-.69.2-.51.67-1.04 1.45-1.04 1.03 0 1.44.78 1.44 1.92V20H20z",
  },
];

function ColumnHeading({ children }) {
  return (
    <div className="mb-6">
      <h4 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white">{children}</h4>
      <span className="mt-3 block h-px w-8" style={{ backgroundColor: GOLD }} />
    </div>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-0 text-[14.5px] text-white/60 transition-colors hover:text-[#DBAF36]"
    >
      <span className="h-px w-0 bg-[#DBAF36] transition-all duration-300 ease-out group-hover:mr-2 group-hover:w-3" />
      {children}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0E0D0B] text-white">
      {/* top hairline + soft gold glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#DBAF36]/60 to-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 h-[420px] w-[420px] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(219,175,54,0.16), transparent 70%)" }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-[30px] py-16 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1.35fr_1fr_1.3fr] lg:gap-10">
          {/* brand */}
          <div className="max-w-[360px]">
            <Link href="/" aria-label="Lute Diamonds home" className="inline-block">
              <img src={LOGO_SRC} alt="Lute Diamonds" className="h-11 w-auto" />
            </Link>

            <p className="mt-6 text-[14.5px] leading-[1.8] text-white/55">{BRAND_TEXT}</p>

            <div className="mt-8 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#DBAF36] hover:bg-[#DBAF36] hover:text-[#0E0D0B]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* shop */}
          <div>
            <ColumnHeading>Shop Now</ColumnHeading>
            <ul className="space-y-3.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* categories */}
          <div>
            <ColumnHeading>Categories</ColumnHeading>
            <ul className="space-y-3.5">
              {CATEGORY_LINKS.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* information */}
          <div>
            <ColumnHeading>Information</ColumnHeading>
            <ul className="space-y-3.5">
              {INFO_LINKS.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* need help */}
          <div>
            <ColumnHeading>Need Help?</ColumnHeading>

            <p className="text-[14.5px] leading-[1.8] text-white/55">
              <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#DBAF36]">
                Head Office
              </span>
              25 Villiers Street, Kimberley
              <br />
              8301, South Africa
            </p>

            <div className="mt-6 space-y-2">
              <a
                href="tel:+27722529457"
                className="block text-[14.5px] text-white/70 transition-colors hover:text-[#DBAF36]"
              >
                +27 72 252 9457
              </a>
              <a
                href="mailto:luteig@gmail.com"
                className="block text-[14.5px] text-white/70 transition-colors hover:text-[#DBAF36]"
              >
                luteig@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col items-center justify-between gap-2 px-[30px] py-6 text-[13.5px] text-white/45 md:flex-row">
          <p>
            &copy; {year} <span className="text-[#DBAF36]">Lute Diamonds</span> (Pty) Ltd. All rights reserved.
          </p>
          <p>
            Powered by{" "}
            <a
              href="https://cybertricksmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#DBAF36] transition-opacity hover:opacity-80"
            >
              Cybertricksmedia Pvt Ltd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}