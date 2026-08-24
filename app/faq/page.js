// app/faq/page.jsx
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "FAQ | Lute Diamonds",
  description:
    "Answers to common questions about ordering, delivery, returns, resizing, certification and caring for your Lute Diamonds jewellery.",
};

const GROUPS = [
  {
    title: "Ordering & payment",
    faqs: [
      {
        q: "How do I place an order?",
        a: "Choose your piece, select a size where one is required, and add it to your cart. At checkout you'll enter your delivery address and pay securely. You'll get an email confirming the order straight away, and a second email with tracking once it's dispatched.",
      },
      {
        q: "What payment methods do you accept?",
        a: `We process payments through ${COMPANY.paymentProcessor}, which supports major credit and debit cards as well as instant EFT from most South African banks. Your card details are entered on their secure environment and never touch our servers.`,
      },
      {
        q: "Do I need an account to buy?",
        a: "An account makes it much easier to track your order, save pieces to a wishlist and start a return later. All we need is your name, email address and a password — no phone number, no social login.",
      },
      {
        q: "Are prices in Rand and do they include VAT?",
        a: `Yes. Every price is in ${COMPANY.currency} and includes VAT at the applicable rate unless the product page says otherwise. Delivery is shown separately at checkout before you pay.`,
      },
      {
        q: "Can I cancel or change my order?",
        a: "Yes, at no charge, as long as the order hasn't been dispatched — just email us as soon as possible. Bespoke pieces can be cancelled free within 24 hours of ordering; after that work has usually started.",
      },
      {
        q: "Do you make custom or bespoke pieces?",
        a: "We do. Send us your idea — a sketch, a reference image, or just a description — along with your budget and the date you need it by. We'll come back with a design proposal and a quote before any work begins.",
      },
    ],
  },
  {
    title: "Shipping & delivery",
    faqs: [
      {
        q: "How long will my order take?",
        a: `Our pieces are handcrafted, so orders are typically dispatched within ${COMPANY.dispatchTime}. Bespoke commissions take longer and we'll give you a timeline upfront. Delivery time after dispatch depends on your location.`,
      },
      {
        q: "How much is delivery?",
        a: `${COMPANY.shipping} — no minimum spend, no delivery fee, ever.`,
      },
      {
        q: "Is my parcel insured?",
        a: "Yes. Every order ships with an insured, tracked courier and requires a signature on delivery. Please make sure someone will be at the address to receive it.",
      },
      {
        q: "Can I track my order?",
        a: "You'll receive tracking details by email as soon as your parcel leaves our workshop. You can also see the status of every order under My Account.",
      },
      {
        q: "Do you ship internationally?",
        a: "We've served international clients since 2006. Email us with the piece and destination country and we'll quote you on shipping and let you know what duties or import taxes to expect — those are payable by you on arrival.",
      },
      {
        q: "My parcel arrived damaged. What now?",
        a: `Note it on the delivery slip before signing if you can, and email us photographs of the packaging and the piece within ${COMPANY.transitClaimHours} hours of delivery. We'll lodge the claim and sort it out.`,
      },
    ],
  },
  {
    title: "Returns, exchanges & resizing",
    faqs: [
      {
        q: "Can I return a piece?",
        a: `Yes. Because you're buying online, South African law gives you ${COMPANY.coolingOffDays} days from delivery to cancel without giving a reason. We extend that to ${COMPANY.returnWindowDays} days for unworn pieces returned in their original packaging with all certificates.`,
      },
      {
        q: "What can't be returned?",
        a: "Bespoke and custom pieces, engraved items, rings that have been resized, pierced earrings once the hygiene seal is broken, and loose stones cut to your specification. This doesn't apply if the item is faulty or isn't what you ordered.",
      },
      {
        q: "How long does a refund take?",
        a: `Once your return reaches us we inspect it within two to three business days, then refund within ${COMPANY.refundDays} business days to your original payment method. Your bank may take a further few days to reflect it.`,
      },
      {
        q: "Do you offer ring resizing?",
        a: "Most rings can be resized. Your first resize within 30 days of delivery is free — after that a workshop fee applies and we'll quote you first. Full eternity bands, tension settings and some gemstone designs can't safely be resized, and we'll tell you upfront if that's the case.",
      },
      {
        q: "I don't know my ring size.",
        a: "Ask us before you order and we'll help you measure at home, or arrange for a jeweller near you to size your finger. Getting it right the first time is much easier than resizing later — and a resized ring can no longer be returned for a change of mind.",
      },
      {
        q: "What if my piece develops a fault?",
        a: "Under the Consumer Protection Act you can return a defective piece within six months of delivery, and you choose whether we repair it, replace it or refund you. That covers genuine manufacturing faults — not accidental damage or normal wear.",
      },
    ],
  },
  {
    title: "Our diamonds & jewellery",
    faqs: [
      {
        q: "Are your diamonds ethically sourced?",
        a: "Yes. We source our diamonds, gemstones and precious metals through channels committed to responsible practice and human rights, and we've built those relationships over nearly two decades of trading from Kimberley.",
      },
      {
        q: "Do you sell natural or laboratory-grown diamonds?",
        a: "Both. Each product page states clearly which one a piece contains. Laboratory-grown diamonds are chemically and optically identical to mined diamonds — the difference is origin and price, not sparkle.",
      },
      {
        q: "Do pieces come with certification?",
        a: "Certification is provided where applicable, and the certificate travels with the piece at delivery. Where a grading report exists, the details on that report are the authoritative description of the stone. Keep it safe — you'll need it for insurance and for any future return.",
      },
      {
        q: "Will the piece look exactly like the photo?",
        a: "Very close, but natural stones are individual. Colour, inclusions and the way light moves through a stone vary from piece to piece, and studio lighting and your screen both affect how a photograph reads. That variation is the nature of the material, not a flaw.",
      },
      {
        q: "How should I care for my jewellery?",
        a: "Take pieces off before swimming, exercising, gardening, sleeping or using cleaning products, perfume and hand sanitiser. Store them separately so harder stones don't scratch softer ones, and clean gently with warm water, mild soap and a soft brush.",
      },
      {
        q: "Do you buy or trade in old jewellery?",
        a: "Get in touch with photographs and any certificates you have, and we'll let you know what's possible.",
      },
    ],
  },
  {
    title: "Account & privacy",
    faqs: [
      {
        q: "I've forgotten my password.",
        a: "Use the reset link on the sign-in page and we'll email you a way back in. If the email doesn't arrive within a few minutes, check your spam folder or contact us.",
      },
      {
        q: "What do you do with my personal information?",
        a: "Only what's needed to process your order and run your account. We never sell your data. The full detail is in our Privacy Policy, which follows POPIA.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes — email us and we'll close it. Tax law requires us to keep invoice records for at least five years, so those specific records are retained even after your account is closed.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="pb-20">
      <div>
        <Breadcrumbs items={[{ label: "FAQ" }]} />
      </div>

      {/* ---------- header ---------- */}
      <div className="container-lute mt-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#141414] to-[#2C2418] px-7 py-10 text-white md:px-12 md:py-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#DBAF36]">
            Lute Diamonds
          </span>
          <h1 className="mt-3 text-[28px] font-medium leading-tight tracking-[-0.01em] md:text-[40px]">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-white/65">
            Ordering, delivery, returns, resizing and caring for your pieces — answered.
          </p>
        </div>
      </div>

      {/* ---------- body ---------- */}
      <div className="container-lute mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A8A8A]">
            Topics
          </p>
          <nav className="mt-4 space-y-1">
            {GROUPS.map((g) => (
              <a
                key={g.title}
                href={`#${slug(g.title)}`}
                className="block rounded-lg px-3 py-1.5 text-[14px] leading-snug text-[#5A5A5A] transition-colors hover:bg-[#FAF8F4] hover:text-[#BF9A3A]"
              >
                {g.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 max-w-[760px] space-y-12">
          {GROUPS.map((group) => (
            <section key={group.title} id={slug(group.title)} className="scroll-mt-32">
              <h2 className="text-[19px] font-medium text-[#141414] sm:text-[21px]">
                {group.title}
              </h2>

              <div className="mt-4 divide-y divide-black/[0.08] overflow-hidden rounded-2xl border border-black/10">
                {group.faqs.map((item) => (
                  <details key={item.q} className="group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#FCFAF6] sm:px-6">
                      <span className="text-[15.5px] font-medium leading-snug text-[#141414]">
                        {item.q}
                      </span>
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/10 text-[#BF9A3A] transition-transform duration-300 group-open:rotate-45">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </summary>
                    <p className="px-5 pb-5 pr-14 text-[14.5px] leading-[1.8] text-[#4A4A4A] sm:px-6 sm:pr-16">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          {/* still stuck */}
          <div className="rounded-2xl border border-black/10 bg-[#FAF8F4] p-6 sm:p-8">
            <h2 className="text-[17px] font-medium text-[#141414]">Didn&rsquo;t find your answer?</h2>
            <p className="mt-2 text-[14.5px] leading-[1.75] text-[#5A5A5A]">
              Email{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-[#BF9A3A] transition-colors hover:text-[#A8862C]"
              >
                {COMPANY.email}
              </a>{" "}
              or call{" "}
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="text-[#BF9A3A] transition-colors hover:text-[#A8862C]"
              >
                {COMPANY.phone}
              </a>
              . You can also read our{" "}
              <Link href="/refund-returns" className="text-[#BF9A3A] hover:underline">
                Refund &amp; Return Policy
              </Link>
              ,{" "}
              <Link href="/terms" className="text-[#BF9A3A] hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#BF9A3A] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-lg bg-[#141414] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#BF9A3A]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}