import crypto from "crypto";

const INITIATE_URL = "https://secure.paygate.co.za/payweb3/initiate.trans";
export const PROCESS_URL = "https://secure.paygate.co.za/payweb3/process.trans";

function md5(input) {
  return crypto.createHash("md5").update(input).digest("hex");
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatTransactionDate(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function parseFormEncoded(text) {
  return Object.fromEntries(new URLSearchParams(text).entries());
}

// Field order is fixed by PayGate's PayWeb3 spec: PAYGATE_ID, REFERENCE, AMOUNT,
// CURRENCY, RETURN_URL, TRANSACTION_DATE, LOCALE, COUNTRY, EMAIL, NOTIFY_URL.
function buildInitiateChecksum(f, encryptionKey) {
  const parts = [f.paygateId, f.reference, f.amount, f.currency, f.returnUrl, f.transactionDate, f.locale, f.country, f.email];
  if (f.notifyUrl) parts.push(f.notifyUrl);
  return md5(parts.join("") + encryptionKey);
}

export async function initiatePayment({ reference, amountInRands, email, returnUrl, notifyUrl }) {
  const paygateId = process.env.PAYGATE_ID;
  const encryptionKey = process.env.PAYGATE_ENCRYPTION_KEY;
  if (!paygateId || !encryptionKey) throw new Error("PayGate is not configured");

  const amount = String(Math.round(amountInRands * 100));
  const transactionDate = formatTransactionDate();
  const locale = "en-za";
  const country = "ZAF";
  const currency = "ZAR";

  const checksum = buildInitiateChecksum(
    { paygateId, reference, amount, currency, returnUrl, transactionDate, locale, country, email, notifyUrl },
    encryptionKey
  );

  const body = new URLSearchParams({
    PAYGATE_ID: paygateId,
    REFERENCE: reference,
    AMOUNT: amount,
    CURRENCY: currency,
    RETURN_URL: returnUrl,
    TRANSACTION_DATE: transactionDate,
    LOCALE: locale,
    COUNTRY: country,
    EMAIL: email,
    NOTIFY_URL: notifyUrl,
    CHECKSUM: checksum,
  });

  const res = await fetch(INITIATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const data = parseFormEncoded(await res.text());

  if (!data.PAY_REQUEST_ID) {
    const error = new Error(data.ERROR || "PayGate did not return a PAY_REQUEST_ID");
    error.raw = data;
    throw error;
  }

  const expectedChecksum = md5(`${data.PAYGATE_ID}${data.PAY_REQUEST_ID}${data.REFERENCE}${encryptionKey}`);
  if (data.CHECKSUM !== expectedChecksum) {
    const error = new Error("PayGate response checksum mismatch");
    error.raw = data;
    throw error;
  }

  return {
    payRequestId: data.PAY_REQUEST_ID,
    reference: data.REFERENCE,
    processUrl: PROCESS_URL,
    // process.trans is posted the SAME checksum PayGate returned above —
    // not a freshly computed one. Recomputing it (e.g. md5(PAY_REQUEST_ID +
    // key)) is what caused the DATA_CHK "unexpected error" on that page.
    processChecksum: data.CHECKSUM,
  };
}

// Field order for the NOTIFY_URL / RETURN_URL callback checksum, per PayGate spec.
export function verifyNotifyChecksum(data) {
  const encryptionKey = process.env.PAYGATE_ENCRYPTION_KEY;
  const expected = md5(
    [
      data.PAYGATE_ID,
      data.PAY_REQUEST_ID,
      data.REFERENCE,
      data.TRANSACTION_STATUS,
      data.RESULT_CODE,
      data.AUTH_CODE,
      data.CURRENCY,
      data.AMOUNT,
      data.RISK_INDICATOR,
      data.PAY_METHOD,
      data.PAY_METHOD_DETAIL,
    ]
      .map((v) => v ?? "")
      .join("") + encryptionKey
  );
  return data.CHECKSUM === expected;
}
