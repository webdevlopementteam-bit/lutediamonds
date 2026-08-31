import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import GalleryStrip from "@/components/GalleryStrip";
import LatestBlog from "@/components/LatestBlog";

export const metadata = {
  title: "Contact | Lute Diamonds",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <main className="bg-white">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />


      <section className="px-5 pb-20 pt-16 md:px-10 md:pt-20 lg:px-16">
        <div className="mx-auto max-w-[1700px]">

          <div className="mx-auto max-w-[1000px] text-center">
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#777] md:text-[13px]">
              WE WOULD LOVE TO HEAR FROM YOU
            </p>

            <h1 className="text-[42px] font-medium leading-tight tracking-[-0.035em] text-[#171717] sm:text-[52px] lg:text-[60px]">
              Get In Touch
            </h1>

            <p className="mx-auto mt-6 max-w-[900px] text-[15px] leading-[1.7] text-[#666] md:text-[17px]">
              We would love to hear from you. At Lute Diamonds, our team is
              here to assist with your jewellery needs, from custom designs
              to aftercare.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:mt-20">

            {/* ADDRESS */}
            <div className="group border-t border-[#dedede] pt-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f3ed] transition-colors duration-300 group-hover:bg-[#DBAF36]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-6 w-6"
                  >
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </div>

                <h2 className="text-[23px] font-medium text-[#171717]">
                  Address
                </h2>
              </div>

              <p className="mt-5 pl-1 text-[15px] leading-7 text-[#666]">
                Head Office: 25 Villiers Street,
                <br />
                Kimberley 8301,
                <br />
                South Africa
              </p>
            </div>

            {/* CONTACT */}
            <div className="group border-t border-[#dedede] pt-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f3ed] transition-colors duration-300 group-hover:bg-[#DBAF36]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-6 w-6"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                  </svg>
                </div>

                <h2 className="text-[23px] font-medium text-[#171717]">
                  Contact Us
                </h2>
              </div>

              <div className="mt-5 space-y-2 pl-1 text-[15px] leading-7 text-[#666]">
                <p>
                  Mobile:{" "}
                  <a
                    href="tel:+27722529457"
                    className="hover:text-[#DBAF36]"
                  >
                    +27 72 252 9457
                  </a>
                </p>

                <p>
                  Mail:{" "}
                  <a
                    href="mailto:luteig@gmail.com"
                    className="hover:text-[#DBAF36]"
                  >
                    luteig@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* HOURS */}
            <div className="group border-t border-[#dedede] pt-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f3ed] transition-colors duration-300 group-hover:bg-[#DBAF36]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-6 w-6"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>

                <h2 className="text-[23px] font-medium text-[#171717]">
                  Hour Of Operation
                </h2>
              </div>

              <div className="mt-5 space-y-2 pl-1 text-[15px] leading-7 text-[#666]">
                <p>Monday-Saturday: 9:00 am - 8:00 pm CST</p>
                <p>Sundays: 10:00 am - 6:00 pm CST</p>
              </div>
            </div>

          </div>
        </div>
      </section>


      <section className="px-5 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1700px] overflow-hidden rounded-[24px] border border-[#e5e5e5] shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="h-[420px] w-full md:h-[500px] lg:h-[620px]">
            <iframe
              title="Lute Diamonds Location"
              src="https://www.google.com/maps?q=25+Villiers+Street,+Kimberley+8301,+South+Africa&output=embed"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

   
      <ContactForm />

      {/* BLOG */}
      <LatestBlog />

      <GalleryStrip/>
    </main>
  );
}