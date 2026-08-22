import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    qty: Number,
    image: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    items: [OrderItemSchema],
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "paygate" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    paygatePaymentId: { type: String, default: "" },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
