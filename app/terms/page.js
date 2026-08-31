// app/terms/page.jsx
import Link from "next/link";
import LegalPage, { P, UL, LI, Note } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Terms & Conditions | Lute Diamonds",
  description:
    "The terms that apply when you use lutediamonds.com or buy a piece from Lute Diamonds (Pty) Ltd.",
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <>
        <P>
          This website is owned and operated by {COMPANY.legalName}, a private company registered
          in South Africa and trading as {COMPANY.tradingName}. We have been crafting fine jewellery
          since 2006.
        </P>
        <UL>
          <LI>
            <strong className="font-medium text-[#141414]">Registered name:</strong>{" "}
            {COMPANY.legalName}
          </LI>
          {COMPANY.registrationNumber && (
            <LI>
              <strong className="font-medium text-[#141414]">Registration number:</strong>{" "}
              {COMPANY.registrationNumber}
            </LI>
          )}
          {COMPANY.vatNumber && (
            <LI>
              <strong className="font-medium text-[#141414]">VAT number:</strong> {COMPANY.vatNumber}
            </LI>
          )}
          <LI>
            <strong className="font-medium text-[#141414]">Head office:</strong> {COMPANY.address}
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Email:</strong>{" "}
            <a href={`mailto:${COMPANY.email}`} className="text-[#BF9A3A] hover:underline">
              {COMPANY.email}
            </a>
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Telephone:</strong>{" "}
            <a href={`tel:${COMPANY.phoneHref}`} className="text-[#BF9A3A] hover:underline">
              {COMPANY.phone}
            </a>
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "acceptance",
    heading: "Accepting these terms",
    body: (
      <>
        <P>
          By browsing this website, creating an account or placing an order, you agree to these
          terms and to our{" "}
          <Link href="/privacy" className="text-[#BF9A3A] hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/refund-returns" className="text-[#BF9A3A] hover:underline">
            Refund &amp; Return Policy
          </Link>
          , which form part of this agreement. If you do not agree, please do not use the site.
        </P>
        <P>
          You must be at least 18 years old and legally able to enter into a contract to buy from
          us. If you are under 18, you may only use this site with the involvement of a parent or
          guardian.
        </P>
      </>
    ),
  },
  {
    id: "accounts",
    heading: "Your account",
    body: (
      <>
        <P>
          You can shop with an account created using your name, email address and a password. Keep
          your password confidential — you are responsible for everything that happens under your
          account.
        </P>
        <P>
          Tell us immediately if you suspect someone else has accessed your account. We may
          suspend or close an account that we reasonably believe is being used fraudulently or in
          breach of these terms.
        </P>
      </>
    ),
  },
  {
    id: "products",
    heading: "Products, images and descriptions",
    body: (
      <>
        <P>
          Our jewellery is handcrafted, and many of our pieces are set with natural diamonds and
          gemstones. No two natural stones are identical: colour, inclusions, and the exact play of
          light will vary from piece to piece and from the photographs on this site.
        </P>
        <P>
          Product images are representative and are photographed under studio lighting, often
          enlarged to show detail. Screens also render colour differently. Slight variation in
          appearance is a characteristic of natural materials and is not a defect.
        </P>
        <P>
          Where a piece is supplied with an independent grading report or certificate, the details
          on that certificate — not the website copy — are the authoritative description of the
          stone. Where a piece is set with laboratory-grown diamonds, this is stated on the product
          page.
        </P>
      </>
    ),
  },
  {
    id: "pricing",
    heading: "Prices and VAT",
    body: (
      <>
        <P>
          All prices are shown in {COMPANY.currency} and include VAT at the applicable rate unless
          stated otherwise on the product page. Delivery charges are shown separately at checkout
          before you pay.
        </P>
        <P>
          Prices can change at any time, but a change after you have placed and paid for an order
          will not affect that order. Precious metal and gemstone prices move with the market, so
          quotations for bespoke work are valid for the period stated on the quote.
        </P>
        <Note>
          Despite our best efforts, an item may occasionally be listed at an incorrect price. If
          the correct price is higher than the listed price, we will contact you before dispatch
          and you may either pay the correct price or cancel for a full refund. We will never
          charge you more without your agreement.
        </Note>
      </>
    ),
  },
  {
    id: "orders",
    heading: "Orders and when a contract is formed",
    body: (
      <>
        <P>
          Placing an order is an offer to buy. Our order confirmation email is an acknowledgement
          that we received it — not acceptance. A binding contract only comes into existence when
          we accept your order and dispatch the goods.
        </P>
        <P>We may decline or cancel an order, and refund you in full, where:</P>
        <UL>
          <LI>The item is out of stock or the stone has already been sold</LI>
          <LI>There was a pricing or description error</LI>
          <LI>Payment could not be verified or is suspected to be fraudulent</LI>
          <LI>We cannot deliver to the address you provided</LI>
        </UL>
      </>
    ),
  },
  {
    id: "payment",
    heading: "Payment",
    body: (
      <>
        <P>
          Payments are processed securely by {COMPANY.paymentProcessor}, a South African payment
          gateway supporting card and EFT payments. Your full card details are entered on their
          secure environment and are never seen or stored on our servers.
        </P>
        <P>
          Orders are only processed once payment has cleared. Goods remain our property until
          payment has been received in full.
        </P>
      </>
    ),
  },
  {
    id: "delivery",
    heading: "Delivery and risk",
    body: (
      <>
        <P>
          Handcrafted pieces are typically dispatched within {COMPANY.dispatchTime}. Bespoke
          commissions take longer and we will give you a timeline before work begins.{" "}
          {COMPANY.shipping} — there is no delivery fee.
        </P>
        <P>
          We ship with insured, tracked couriers and email you the tracking details on dispatch. A
          signature is required on delivery. Delivery timeframes are estimates and are not
          guaranteed — we are not liable for courier delays outside our control, though we will
          always help you follow them up.
        </P>
        <P>
          Risk in the goods passes to you on delivery. Please make sure someone is available at the
          address to receive and sign for the parcel.
        </P>
      </>
    ),
  },
  {
    id: "returns-link",
    heading: "Returns and cancellations",
    body: (
      <P>
        Your return, exchange, resizing and cancellation rights are set out in full in our{" "}
        <Link href="/refund-returns" className="text-[#BF9A3A] hover:underline">
          Refund &amp; Return Policy
        </Link>
        , including the {COMPANY.coolingOffDays}-day cooling-off right that applies to online
        purchases under South African law.
      </P>
    ),
  },
  {
    id: "care",
    heading: "Care and workmanship",
    body: (
      <>
        <P>
          Fine jewellery needs care. Remove your pieces before swimming, exercising, gardening,
          sleeping or using household chemicals, perfumes and hand sanitiser. Store pieces
          separately so harder stones do not scratch softer ones.
        </P>
        <P>
          We stand behind our workmanship and will put right genuine manufacturing faults as set
          out in our Refund &amp; Return Policy. Damage caused by accident, misuse, normal wear and
          tear, or by work done by another jeweller is not covered.
        </P>
      </>
    ),
  },
  {
    id: "intellectual-property",
    heading: "Intellectual property",
    body: (
      <P>
        All content on this site — including our designs, photographs, text, logos and the
        Lute Diamonds name — belongs to us or our licensors and is protected by copyright and
        trade mark law. You may browse and print pages for your own personal use. You may not
        copy, republish, sell or use our images or designs commercially without our written
        permission.
      </P>
    ),
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    body: (
      <>
        <P>You agree not to:</P>
        <UL>
          <LI>Use the site for any unlawful purpose or to place fraudulent orders</LI>
          <LI>Attempt to gain unauthorised access to any part of the site or its systems</LI>
          <LI>Introduce malware, or scrape or harvest data from the site by automated means</LI>
          <LI>Post reviews or content that are false, defamatory or infringe someone else's rights</LI>
        </UL>
      </>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: (
      <>
        <P>
          We take care to keep this site accurate and available, but we do not warrant that it will
          be uninterrupted or error-free.
        </P>
        <P>
          To the fullest extent permitted by law, we are not liable for indirect or consequential
          loss — including loss of profit or opportunity — arising from your use of this site.
          Nothing in these terms limits our liability for death or personal injury caused by our
          negligence, for fraud, or for any liability that cannot lawfully be excluded under the
          Consumer Protection Act.
        </P>
        <P>
          We are not responsible for failures caused by events beyond our reasonable control,
          including load shedding, strikes, natural disasters, or courier and network failures.
        </P>
      </>
    ),
  },
  {
    id: "privacy-link",
    heading: "Privacy",
    body: (
      <P>
        How we collect and handle your personal information is explained in our{" "}
        <Link href="/privacy" className="text-[#BF9A3A] hover:underline">
          Privacy Policy
        </Link>
        , which complies with the Protection of Personal Information Act 4 of 2013 (POPIA).
      </P>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing law and disputes",
    body: (
      <>
        <P>
          These terms are governed by the laws of the Republic of South Africa, and you consent to
          the jurisdiction of the South African courts.
        </P>
        <P>
          If you are unhappy with something, please contact us first — most issues are settled
          quickly and directly. If we cannot resolve it, you may refer the matter to the National
          Consumer Commission or an accredited consumer ombud.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    body: (
      <P>
        We may update these terms from time to time. The version published on this page at the
        moment you place an order is the version that applies to that order. The date at the top of
        this page shows when it was last revised.
      </P>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      breadcrumb="Terms & Conditions"
      subtitle="The agreement between you and Lute Diamonds (Pty) Ltd when you use this website or buy from us."
      sections={SECTIONS}
    />
  );
}