import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { initiatePayment } from "@/lib/paygate";

export async function POST(req) {
  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: "Order id required" }, { status: 400 });

  await connectDB();
  const order = await Order.findById(orderId).lean();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const site = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    const result = await initiatePayment({
      reference: order.orderNumber,
      amountInRands: order.total,
      email: order.shippingAddress?.email || "",
      returnUrl: `${site}/checkout/success?order=${order.orderNumber}`,
      notifyUrl: `${site}/api/paygate/notify`,
    });

    await Order.findByIdAndUpdate(order._id, {
      paymentMethod: "paygate",
      paygatePaymentId: result.payRequestId,
    });

    return NextResponse.json({
      actionUrl: result.processUrl,
      fields: { PAY_REQUEST_ID: result.payRequestId, CHECKSUM: result.processChecksum },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message, details: err.raw }, { status: 502 });
  }
}
