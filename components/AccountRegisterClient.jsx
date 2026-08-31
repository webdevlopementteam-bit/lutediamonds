// app/account/register/page.jsx
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

/* 👇 apni image ka path change kar lena */
const SIDE_IMAGE = "/home/hero3.jpeg";
const LOGO_SRC = "/logo.png";

const EyeIcon = ({ open, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {open ? (
      <>
        <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M4 4l16 16" />
        <path d="M9.9 5.8A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.4 4.1M6.4 7.9A16.7 16.7 0 0 0 2.5 12S6 18.5 12 18.5c1.3 0 2.4-.3 3.5-.7" />
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      </>
    )}
  </svg>
);

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-black/10 bg-white px-4 py-3.5 text-[15px] text-[#141414] outline-none transition-all placeholder:text-[#A5A5A5] focus:border-[#BF9A3A] focus:ring-2 focus:ring-[#BF9A3A]/20";

  const labelClass =
    "mb-2 block text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]";

  const passwordOk = form.password.length >= 8;

  return (
    <div className="grid min-h-[70vh] lg:min-h-[calc(100vh-120px)] lg:grid-cols-2">
      {/* ---------- left visual (desktop only) ---------- */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src={SIDE_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
        <div className="relative flex h-full flex-col justify-end p-12 xl:p-16">
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#DBAF36]">
            Lute Diamonds
          </span>
          <h2 className="mt-4 max-w-[420px] text-[34px] font-medium leading-[1.15] text-white xl:text-[42px]">
            Begin your collection with us
          </h2>
          <p className="mt-4 max-w-[420px] text-[15px] leading-[1.7] text-white/70">
            Create an account to save your favourite pieces, follow your orders and check out in
            seconds.
          </p>
        </div>
      </div>

      {/* ---------- form ---------- */}
      <div className="flex items-center justify-center px-5 py-14 sm:px-10 lg:py-20">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="mb-10 inline-block lg:hidden">
            <img src={LOGO_SRC} alt="Lute Diamonds" className="h-10 w-auto" />
          </Link>

          <h1 className="text-[28px] font-medium leading-tight tracking-[-0.01em] text-[#141414] sm:text-[32px]">
            Create an Account
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#6B6B6B]">
            All we need is your name, email address and a password.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name
              </label>
              <input
                id="name"
                required
                autoComplete="name"
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#8A8A8A] transition-colors hover:text-[#BF9A3A]"
                >
                  <EyeIcon open={showPassword} className="h-5 w-5" />
                </button>
              </div>

              <p
                className={`mt-2 text-[12.5px] transition-colors ${
                  form.password.length === 0
                    ? "text-[#9A9A9A]"
                    : passwordOk
                    ? "text-emerald-600"
                    : "text-[#9A9A9A]"
                }`}
              >
                {passwordOk ? "Looks good." : "At least 8 characters."}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#BF9A3A] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#A8862C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {submitting ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-[12.5px] leading-relaxed text-[#9A9A9A]">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-[#BF9A3A]">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-[#BF9A3A]">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-black/10" />
            <span className="text-[12px] uppercase tracking-[0.1em] text-[#9A9A9A]">or</span>
            <span className="h-px flex-1 bg-black/10" />
          </div>

          <p className="mt-6 text-center text-[15px] text-[#6B6B6B]">
            Already have an account?{" "}
            <Link
              href={`/account/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="font-medium text-[#BF9A3A] underline decoration-1 underline-offset-4 hover:text-[#A8862C]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterSkeleton() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <div className="w-full max-w-[420px] animate-pulse space-y-5">
        <div className="h-8 w-56 rounded bg-black/10" />
        <div className="h-12 w-full rounded-lg bg-black/[0.07]" />
        <div className="h-12 w-full rounded-lg bg-black/[0.07]" />
        <div className="h-12 w-full rounded-lg bg-black/[0.07]" />
        <div className="h-12 w-full rounded-lg bg-black/10" />
      </div>
    </div>
  );
}

export default function AccountRegisterClient() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}