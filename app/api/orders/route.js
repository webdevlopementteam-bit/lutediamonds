import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser, getCurrentAdmin } from "@/lib/auth";

function generateOrderNumber() {
  return "LD" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export async function POST(req) {
  const body = await req.json();
  const { items, shippingAddress } = body;

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!shippingAddress?.fullName || !shippingAddress?.email || !shippingAddress?.address) {
    return NextResponse.json({ error: "Shipping details are required" }, { status: 400 });
  }

  await connectDB();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  // Shipping is free storewide — no threshold, no flat fee.
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const session = await getCurrentUser();

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: session?.sub || null,
    items,
    shippingAddress,
    subtotal,
    shippingFee,
    total,
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET(req) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const query = status ? { orderStatus: status } : {};
  const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ items: orders });
}
