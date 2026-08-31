// app/refund-returns/page.jsx
import Link from "next/link";
import LegalPage, { P, UL, LI, Note } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Refund & Return Policy | Lute Diamonds",
  description:
    "How to return, exchange or get a refund on a Lute Diamonds piece, including your cooling-off rights under South African law.",
  alternates: { canonical: "/delivery-returns" },
};

const SECTIONS = [
  {
    id: "overview",
    heading: "Overview",
    body: (
      <>
        <P>
          Every piece we sell is handcrafted and inspected before it leaves our workshop in
          Kimberley. If something is not right, we want to fix it. This policy explains when you
          can return a piece, how to do it, and how quickly you will get your money back.
        </P>
        <P>
          Nothing in this policy takes away the rights you have under the Consumer Protection Act
          68 of 2008 (CPA) or the Electronic Communications and Transactions Act 25 of 2002 (ECTA).
          Where this policy is more generous than the law, this policy applies.
        </P>
      </>
    ),
  },
  {
    id: "cooling-off",
    heading: `Your ${COMPANY.coolingOffDays}-day cooling-off right`,
    body: (
      <>
        <P>
          Because you are buying online, section 44 of ECTA gives you the right to cancel your
          order without giving a reason and without penalty within{" "}
          {COMPANY.coolingOffDays} days of receiving the goods. You simply need to send the piece
          back to us in the condition described below.
        </P>
        <P>
          We will refund you in full within 30 days of the cancellation. You are responsible for
          the cost of returning the goods to us, and we strongly recommend using an insured,
          tracked courier given the value of our pieces.
        </P>
        <Note>
          The cooling-off right does not apply to goods made to your own specification or clearly
          personalised — for example a bespoke design, an engraved piece, or a ring resized to
          your finger before dispatch.
        </Note>
      </>
    ),
  },
  {
    id: "change-of-mind",
    heading: `${COMPANY.returnWindowDays}-day change-of-mind returns`,
    body: (
      <>
        <P>
          Beyond the cooling-off period, we give you a total of {COMPANY.returnWindowDays} days
          from the date of delivery to return an unworn piece for a refund or exchange. The
          request must reach us within those {COMPANY.returnWindowDays} days, even if the parcel
          arrives with us shortly afterwards.
        </P>
        <P>To be accepted, the piece must come back to us:</P>
        <UL>
          <LI>Unworn, unaltered and free of scratches, sizing marks or body oils</LI>
          <LI>In its original box and protective packaging</LI>
          <LI>
            With every item it was sent with — certificates, grading reports, valuation
            documents, care cards and tags still attached
          </LI>
          <LI>With proof of purchase or your order number</LI>
        </UL>
        <P>
          Pieces that show wear, have been altered by another jeweller, or arrive without their
          certification cannot be accepted and will be returned to you at your cost.
        </P>
      </>
    ),
  },
  {
    id: "exclusions",
    heading: "What we cannot take back",
    body: (
      <>
        <P>The following are final sale and cannot be returned for a change of mind:</P>
        <UL>
          <LI>Bespoke and custom-commissioned pieces</LI>
          <LI>Engraved or otherwise personalised items</LI>
          <LI>Rings that have been resized, whether by us or by another jeweller</LI>
          <LI>Pierced earrings, once the hygiene seal has been broken</LI>
          <LI>Loose polished stones cut or selected to your specification</LI>
          <LI>Gift cards and vouchers</LI>
        </UL>
        <P>
          This exclusion does not apply if the item is faulty, damaged or not what you ordered —
          see <a href="#faulty" className="text-[#BF9A3A] hover:underline">Faulty or incorrect items</a> below.
        </P>
      </>
    ),
  },
  {
    id: "how-to-return",
    heading: "How to start a return",
    body: (
      <>
        <UL>
          <LI>
            Email{" "}
            <a href={`mailto:${COMPANY.email}`} className="text-[#BF9A3A] hover:underline">
              {COMPANY.email}
            </a>{" "}
            with your order number, the item you want to return, and the reason. Photographs help
            us resolve faults faster.
          </LI>
          <LI>
            We will reply within two business days with a return authorisation and the exact
            address to send the parcel to. Please do not post anything back before you have this
            — unauthorised parcels may be refused.
          </LI>
          <LI>
            Pack the piece in its original box, include all documentation, and send it with an
            insured, tracked courier. Insure it for the full purchase value.
          </LI>
          <LI>
            Send us the tracking number. Until the parcel reaches us, it remains your
            responsibility.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "refunds",
    heading: "Refunds",
    body: (
      <>
        <P>
          Once your return arrives, our workshop inspects the piece and verifies its
          certification. This usually takes two to three business days. We will email you the
          outcome either way.
        </P>
        <P>
          Approved refunds are paid within {COMPANY.refundDays} business days of that inspection,
          to the original payment method through {COMPANY.paymentProcessor}. We cannot refund to a
          different card or account. Depending on your bank, the money may take a further three to
          five business days to reflect.
        </P>
        <P>
          We refund the price you paid for the item. Original delivery charges are refunded only
          where the return is due to a fault on our side, an incorrect item, or a cancellation
          within the cooling-off period.
        </P>
      </>
    ),
  },
  {
    id: "exchanges",
    heading: "Exchanges and resizing",
    body: (
      <>
        <P>
          Prefer a different piece? Tell us in your return email and we will hold the replacement
          for you. If the new piece costs more, we will send a secure payment link for the
          difference; if it costs less, we refund the balance.
        </P>
        <P>
          Most rings can be resized after purchase. Your first resize within 30 days of delivery is
          free of charge; after that, or for a second resize, a workshop fee applies and we will
          quote you before starting. Some settings — full eternity bands, tension settings and
          certain gemstone designs — cannot safely be resized, and we will tell you upfront if
          that is the case.
        </P>
        <Note>
          Once a ring has been resized it is considered altered and can no longer be returned for
          a change of mind. If you are unsure of your size, ask us for a ring sizer before you
          order.
        </Note>
      </>
    ),
  },
  {
    id: "faulty",
    heading: "Faulty or incorrect items",
    body: (
      <>
        <P>
          Under section 56 of the CPA, if a piece is defective, unsafe or not of the quality you
          are reasonably entitled to expect, you may return it within six months of delivery. You
          choose whether we repair it, replace it, or refund you in full — and we cover the cost
          of collection.
        </P>
        <P>
          This covers genuine manufacturing faults such as a stone that comes loose from a sound
          setting, a clasp that fails in normal use, or a soldered joint that separates. It does
          not cover damage from accidents, knocks, chemical exposure, sport, or wear and tear over
          time, and it does not cover work done by another jeweller.
        </P>
        <P>
          If we send you the wrong item, tell us within {COMPANY.transitClaimHours} hours of
          delivery and we will arrange collection and dispatch the correct piece at our cost.
        </P>
      </>
    ),
  },
  {
    id: "damaged-in-transit",
    heading: "Parcels damaged in transit",
    body: (
      <>
        <P>
          Check your parcel in front of the courier where possible. If the outer packaging is
          torn, opened or tampered with, note it on the delivery slip before signing.
        </P>
        <P>
          Report any transit damage or a missing item to us within {COMPANY.transitClaimHours}{" "}
          hours of delivery, with photographs of the packaging and the piece. Claims outside this
          window are difficult for us to lodge with the courier and may not be covered.
        </P>
      </>
    ),
  },
  {
    id: "cancellations",
    heading: "Cancelling before dispatch",
    body: (
      <P>
        You can cancel a standard order at no charge any time before it is dispatched — just email
        us as soon as possible. Bespoke and made-to-order pieces can be cancelled without charge
        within 24 hours of ordering; after that, work has usually begun and we may retain a
        reasonable deposit to cover materials and labour already committed, as permitted under
        section 17 of the CPA.
      </P>
    ),
  },
  {
    id: "contact-returns",
    heading: "Questions",
    body: (
      <P>
        Email{" "}
        <a href={`mailto:${COMPANY.email}`} className="text-[#BF9A3A] hover:underline">
          {COMPANY.email}
        </a>{" "}
        or call{" "}
        <a href={`tel:${COMPANY.phoneHref}`} className="text-[#BF9A3A] hover:underline">
          {COMPANY.phone}
        </a>
        . You can also read our{" "}
        <Link href="/terms" className="text-[#BF9A3A] hover:underline">
          Terms &amp; Conditions
        </Link>{" "}
        or the{" "}
        <Link href="/faq" className="text-[#BF9A3A] hover:underline">
          FAQ
        </Link>
        .
      </P>
    ),
  },
];

export default function RefundReturnsPage() {
  return (
    <LegalPage
      title="Refund & Return Policy"
      breadcrumb="Refund & Returns"
      subtitle="Returns, exchanges, resizing and refunds — plus the rights South African law gives you when you buy online."
      sections={SECTIONS}
    />
  );
}