"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessRedirectTimer({ order, seconds = 3 }) {
  const router = useRouter();
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (count <= 0) {
      try {
        sessionStorage.setItem("lute_last_order", JSON.stringify(order));
      } catch {}
      router.replace("/thank-you");
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, order, router]);

  return (
    <p className="text-muted text-sm mb-8">
      Redirecting to your order confirmation in {count}s...
    </p>
  );
}
