import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { queryPayment } from "@/lib/paygate";

// If an order is still "pending" but has a PayGate PAY_REQUEST_ID attached,
// actively ask PayGate what actually happened instead of leaving it stuck —
// customers who abandon the PayGate page without submitting anything never
// trigger a NOTIFY_URL webhook, so nothing would otherwise resolve it.
// Call this wherever a pending order gets looked at (success page, account
// order detail, admin order detail).
export async function resolvePendingPayment(order) {
  if (order.paymentStatus !== "pending" || !order.paygatePaymentId) return order;

  try {
    const result = await queryPayment({
      payRequestId: order.paygatePaymentId,
      reference: order.orderNumber,
    });

    // PayGate has no record at all for a PAY_REQUEST_ID that was generated
    // but never actually submitted (customer left the payment page without
    // entering anything) — that itself is a definitive "never happened"
    // signal, not a reason to keep waiting.
    const abandoned = result.ERROR === "NO_TRANS_DATA";
    if (!result.TRANSACTION_STATUS && !abandoned) return order;

    const paymentStatus = result.TRANSACTION_STATUS === "1" ? "paid" : "failed";
    const update = { paymentStatus };
    if (paymentStatus === "paid") update.orderStatus = "processing";

    await connectDB();
    const updated = await Order.findByIdAndUpdate(order._id, update, { new: true }).lean();
    return updated || order;
  } catch {
    // Network hiccup talking to PayGate — leave it pending, the next
    // person to view this order will trigger another attempt.
    return order;
  }
}
