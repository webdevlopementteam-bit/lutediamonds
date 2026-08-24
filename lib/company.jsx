// lib/company.js
// Saari business details ek jagah — legal pages yahi se padhte hain.
// Khaali strings wali lines page pe render nahi hongi, to jo pata ho wahi bharo.

export const COMPANY = {
  legalName: "Lute Diamonds (Pty) Ltd",
  tradingName: "Lute Diamonds",

  // 👇 CIPC certificate se bhar dena (ECTA s43 ke liye zaroori hai)
  registrationNumber: "",
  // 👇 VAT registered ho to daalo, warna khaali chhodo
  vatNumber: "",
  // 👇 POPIA Information Officer ka naam (default: company ka director/CEO)
  informationOfficer: "",

  address: "25 Villiers Street, Kimberley, 8301, South Africa",
  email: "luteig@gmail.com",
  phone: "+27 72 252 9457",
  phoneHref: "+27722529457",
  website: "https://www.lutediamonds.com",

  paymentProcessor: "PayGate",
  currency: "South African Rand (ZAR)",

  // policy numbers — ek jagah change karo, chaaron pages pe update ho jayega
  coolingOffDays: 7,
  returnWindowDays: 14,
  refundDays: 10,
  transitClaimHours: 48,
  dispatchTime: "5–10 business days",
  // Shipping is free storewide (no threshold, no flat fee) — see app/api/orders/route.js.
  // freeShippingThreshold: "R50,000",
  // flatShippingFee: "R500",
  shipping: "Free on all orders",

  lastUpdated: "21 August 2026",
};

export const fmtList = (arr) => arr.filter(Boolean).join(", ");