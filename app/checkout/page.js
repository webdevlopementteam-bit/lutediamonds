import CheckoutClient from "@/components/CheckoutClient";

export const metadata = {
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
