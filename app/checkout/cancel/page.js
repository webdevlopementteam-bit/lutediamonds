import Link from "next/link";

export const metadata = {
  alternates: { canonical: "/checkout/cancel" },
};

export default function CheckoutCancelPage() {
  return (
    <div className="container-lute max-w-xl py-20 text-center">
      <h1 className="font-serif text-3xl mb-4">Payment Cancelled</h1>
      <p className="text-muted mb-6">
        Your payment was not completed. Your order has been saved as pending — you can try
        checking out again or contact us for help.
      </p>
      <Link href="/cart" className="btn-gold px-6 py-3 rounded text-sm">
        Return to Cart
      </Link>
    </div>
  );
}
