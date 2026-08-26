import { Inter_Tight } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lute Diamonds | Buy Certified Tanzanite Jewellery in UK",
  description:
    " Lute Diamonds offers certified Tanzanite jewellery in UK & Europe — engagement rings, earrings, bracelets & sets. Handcrafted, ethically sourced. Browse our Tanzanite jewellery now. ",
  keywords: [
    "Lute Diamonds", "Certified Tanzanite Jewellery in UK", "Certified Tanzanite Jewellery in Europe",
  ],
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${interTight.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
