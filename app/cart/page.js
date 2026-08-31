import CartClient from "@/components/CartClient";

export const metadata = {
  title: "Cart | Lute Diamonds",
  description: null,
  keywords: ["cart"],
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return <CartClient />;
}
