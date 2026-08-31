import AccountLoginClient from "@/components/AccountLoginClient";

export const metadata = {
  alternates: { canonical: "/account/login" },
};

export default function LoginPage() {
  return <AccountLoginClient />;
}
