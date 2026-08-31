import AccountRegisterClient from "@/components/AccountRegisterClient";

export const metadata = {
  alternates: { canonical: "/account/register" },
};

export default function RegisterPage() {
  return <AccountRegisterClient />;
}
