// app/privacy/page.jsx
import Link from "next/link";
import LegalPage, { P, UL, LI, Note } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Privacy Policy | Lute Diamonds",
  description:
    "How Lute Diamonds (Pty) Ltd collects, uses and protects your personal information under POPIA.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    id: "introduction",
    heading: "Introduction",
    body: (
      <>
        <P>
          {COMPANY.legalName} respects your privacy. This policy explains what personal information
          we collect when you visit {COMPANY.website.replace("https://", "")}, why we collect it,
          who we share it with, and the rights you have over it.
        </P>
        <P>
          We process personal information in line with the Protection of Personal Information Act 4
          of 2013 (POPIA). We are the responsible party for the information described here.
        </P>
      </>
    ),
  },
  {
    id: "information-officer",
    heading: "Information Officer",
    body: (
      <>
        <P>
          Questions about this policy, or requests about your personal information, should go to
          our Information Officer:
        </P>
        <UL>
          {COMPANY.informationOfficer && (
            <LI>
              <strong className="font-medium text-[#141414]">Name:</strong>{" "}
              {COMPANY.informationOfficer}
            </LI>
          )}
          <LI>
            <strong className="font-medium text-[#141414]">Email:</strong>{" "}
            <a href={`mailto:${COMPANY.email}`} className="text-[#BF9A3A] hover:underline">
              {COMPANY.email}
            </a>
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Post:</strong> {COMPANY.legalName},{" "}
            {COMPANY.address}
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: (
      <>
        <P>We keep this deliberately minimal. Depending on how you use the site, we may hold:</P>
        <UL>
          <LI>
            <strong className="font-medium text-[#141414]">Account details</strong> — your name,
            email address and an encrypted version of your password. We do not ask for a phone
            number or a social login to register.
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Order details</strong> — delivery
            address, contact number for the courier, the items you bought, and your order history.
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Correspondence</strong> — messages you
            send us by email, the contact form or social media, and our replies.
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Content you post</strong> — product
            reviews, ratings and wishlist items.
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Technical information</strong> — IP
            address, browser and device type, pages viewed and referring links, collected through
            cookies and server logs.
          </LI>
        </UL>
        <Note>
          We never see or store your full card number, CVV or banking login. Card payments are
          entered directly on {COMPANY.paymentProcessor}'s secure environment. We only receive
          confirmation that a payment succeeded or failed.
        </Note>
      </>
    ),
  },
  {
    id: "why-we-process",
    heading: "Why we process it",
    body: (
      <>
        <UL>
          <LI>
            <strong className="font-medium text-[#141414]">To fulfil your order</strong> — process
            payment, arrange delivery, handle returns and honour warranties. This is necessary to
            perform our contract with you.
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">To manage your account</strong> —
            authenticate you, show your order history and wishlist, and reset your password.
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">To support you</strong> — answer
            questions and resolve complaints.
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">To meet legal obligations</strong> —
            tax and accounting records, and any obligations relating to the trade in precious
            stones and metals.
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">To protect the business</strong> —
            detect and prevent fraud and abuse. This is our legitimate interest.
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">To send marketing</strong> — only if you
            have opted in, or if you are an existing customer and we are telling you about similar
            pieces. You can opt out at any time.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "sharing",
    heading: "Who we share it with",
    body: (
      <>
        <P>
          We do not sell your personal information, and we never rent or trade it. We share only
          what is necessary, with:
        </P>
        <UL>
          <LI>
            <strong className="font-medium text-[#141414]">{COMPANY.paymentProcessor}</strong> — to
            process and verify your payment
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Courier partners</strong> — your name,
            delivery address and contact number, so they can deliver your parcel
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Hosting and email providers</strong> —
            who store the site and send transactional emails on our behalf
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Professional advisers</strong> — our
            accountants and, where necessary, our attorneys
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Authorities</strong> — where the law
            requires it, or to establish or defend a legal claim
          </LI>
        </UL>
        <P>
          These operators may only use your information to provide their service to us, and are
          required to keep it secure and confidential.
        </P>
      </>
    ),
  },
  {
    id: "cross-border",
    heading: "Transfers outside South Africa",
    body: (
      <P>
        Some of our service providers — for example hosting and email delivery — operate servers
        outside South Africa. Where information leaves the country, we only use providers who are
        subject to laws or binding agreements that give your information a level of protection
        comparable to POPIA, as required by section 72.
      </P>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies",
    body: (
      <>
        <P>Cookies are small files stored by your browser. We use them for:</P>
        <UL>
          <LI>
            <strong className="font-medium text-[#141414]">Essential functions</strong> — keeping
            you signed in and remembering your cart and wishlist. The site cannot work without
            these.
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Analytics</strong> — understanding which
            pages are visited so we can improve the store. This data is aggregated.
          </LI>
        </UL>
        <P>
          You can block or delete cookies in your browser settings, but blocking essential cookies
          will stop you from signing in or checking out.
        </P>
      </>
    ),
  },
  {
    id: "retention",
    heading: "How long we keep it",
    body: (
      <>
        <UL>
          <LI>
            <strong className="font-medium text-[#141414]">Order and invoice records</strong> — at
            least five years, as required by South African tax law
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Account details</strong> — until you ask
            us to close your account
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Marketing consent</strong> — until you
            withdraw it
          </LI>
          <LI>
            <strong className="font-medium text-[#141414]">Support emails</strong> — up to three
            years after the matter is closed
          </LI>
        </UL>
        <P>
          When information is no longer needed, we delete it or de-identify it so it can no longer
          be linked to you.
        </P>
      </>
    ),
  },
  {
    id: "security",
    heading: "How we protect it",
    body: (
      <P>
        The site runs over encrypted HTTPS connections and passwords are stored hashed, never in
        plain text. Access to customer data is limited to staff who need it. No system is
        completely secure, but if a breach ever affects your personal information we will notify
        you and the Information Regulator as POPIA requires.
      </P>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights",
    body: (
      <>
        <P>Under POPIA you have the right to:</P>
        <UL>
          <LI>Ask what personal information we hold about you, and get a copy of it</LI>
          <LI>Ask us to correct or complete anything that is inaccurate</LI>
          <LI>Ask us to delete or destroy information we no longer have a reason to keep</LI>
          <LI>Object to processing based on our legitimate interests</LI>
          <LI>Withdraw your consent to marketing at any time</LI>
          <LI>Complain to the Information Regulator</LI>
        </UL>
        <P>
          Email{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-[#BF9A3A] hover:underline">
            {COMPANY.email}
          </a>{" "}
          to exercise any of these. We may ask you to verify your identity first, and will respond
          within a reasonable time. Some records — such as tax invoices — must be kept even after
          you close your account.
        </P>
      </>
    ),
  },
  {
    id: "marketing",
    heading: "Marketing emails",
    body: (
      <P>
        We only send marketing where you have opted in or where you have bought from us before.
        Every marketing email has an unsubscribe link, and you can also reply asking to be removed.
        Transactional emails — order confirmations, dispatch notices, password resets — are part of
        the service and will still be sent.
      </P>
    ),
  },
  {
    id: "children",
    heading: "Children",
    body: (
      <P>
        This store is intended for adults. We do not knowingly collect personal information from
        anyone under 18 without the consent of a parent or guardian. If you believe a child has
        given us their information, contact us and we will delete it.
      </P>
    ),
  },
  {
    id: "regulator",
    heading: "Complaints to the Regulator",
    body: (
      <>
        <P>
          If you believe we have handled your personal information unlawfully, please raise it with
          us first. You also have the right to lodge a complaint with:
        </P>
        <UL>
          <LI>
            <strong className="font-medium text-[#141414]">
              The Information Regulator (South Africa)
            </strong>
          </LI>
          <LI>JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001</LI>
          <LI>
            Website:{" "}
            <a
              href="https://inforegulator.org.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#BF9A3A] hover:underline"
            >
              inforegulator.org.za
            </a>
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "changes-privacy",
    heading: "Changes to this policy",
    body: (
      <P>
        We may update this policy as our business or the law changes. The revision date at the top
        of the page tells you when it last changed. Material changes will be communicated by email
        or a notice on the site. Our{" "}
        <Link href="/terms" className="text-[#BF9A3A] hover:underline">
          Terms &amp; Conditions
        </Link>{" "}
        should be read together with this policy.
      </P>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      breadcrumb="Privacy Policy"
      subtitle="What we collect, why we collect it, and the control you have over your personal information under POPIA."
      sections={SECTIONS}
    />
  );
}