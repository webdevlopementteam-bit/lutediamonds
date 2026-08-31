import Link from "next/link";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { formatZAR } from "@/lib/format";
import { resolvePendingPayment } from "@/lib/resolvePayment";

export const metadata = {
  alternates: { canonical: "/checkout/success" },
};

export default async function CheckoutSuccessPage({ searchParams }) {
  const sp = await searchParams;
  await connectDB();
  let order = sp.order ? await Order.findOne({ orderNumber: sp.order }).lean() : null;
  if (order) order = await resolvePendingPayment(order);

  const heading =
    order?.paymentStatus === "failed"
      ? "Payment was not completed"
      : order?.paymentStatus === "paid"
        ? "Thank you for your order!"
        : "Order received";

  const message =
    order?.paymentStatus === "paid"
      ? "Payment confirmed."
      : order?.paymentStatus === "failed"
        ? "Your payment with PayGate wasn't completed — this happens if the payment page was closed or cancelled before finishing. Your order is saved as pending; you can try paying again from your order history, or contact us for help."
        : "We're confirming your payment with PayGate — this can take a minute. Refresh this page shortly to see the update.";

  return (
    <div className="container-lute max-w-xl py-20 text-center">
      <h1 className="font-serif text-3xl mb-4">{heading}</h1>

      {order ? (
        <>
          <p className="text-muted mb-6">
            Order <span className="text-foreground font-medium">{order.orderNumber}</span>. {message}
          </p>
          <div className="border border-border rounded-lg p-6 text-left mb-8">
            <div className="flex justify-between text-sm py-1">
              <span>Order Status</span>
              <span className="capitalize">{order.orderStatus}</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span>Payment Status</span>
              <span className="capitalize">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between font-medium py-1">
              <span>Total</span>
              <span>{formatZAR(order.total)}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-muted mb-6">Your order has been placed.</p>
      )}

      <Link href="/shop" className="btn-gold px-6 py-3 rounded text-sm">
        Continue Shopping
      </Link>
    </div>
  );
}
