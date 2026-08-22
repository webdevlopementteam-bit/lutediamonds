import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyNotifyChecksum } from "@/lib/paygate";

export async function POST(req) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  if (!verifyNotifyChecksum(data)) {
    return NextResponse.json({ error: "Invalid checksum" }, { status: 400 });
  }

  await connectDB();

  const order = await Order.findOne({ orderNumber: data.REFERENCE });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (data.TRANSACTION_STATUS === "1") {
    order.paymentStatus = "paid";
    order.orderStatus = "processing";
  } else {
    order.paymentStatus = "failed";
  }
  order.paygatePaymentId = data.PAY_REQUEST_ID || order.paygatePaymentId;
  await order.save();

  return new NextResponse("OK", { status: 200 });
}
