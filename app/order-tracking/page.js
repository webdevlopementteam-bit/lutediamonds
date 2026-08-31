import OrderTrackingClient from "@/components/OrderTrackingClient";

export const metadata = {
  alternates: { canonical: "/order-tracking" },
};

export default function OrderTrackingPage() {
  return <OrderTrackingClient />;
}
