export function digitsOnly(raw) {
  return String(raw ?? "").replace(/\D/g, "");
}

export function normalizeLocalPhone(raw, countryCode = "+91", maxDigits = 10) {
  let digits = digitsOnly(raw);
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  const cc = digitsOnly(countryCode) || "91";
  if (digits.length > maxDigits && digits.startsWith(cc)) {
    digits = digits.slice(cc.length);
  }
  if (cc === "91" && digits.length === maxDigits + 1 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  if (digits.length > maxDigits) digits = digits.slice(-maxDigits);
  return digits.slice(0, maxDigits);
}

export function sanitizePhoneInput(raw, maxDigits = 10) {
  return digitsOnly(raw).slice(0, maxDigits);
}

export function formatInternationalPhone(raw, countryCode = "+91") {
  const local = normalizeLocalPhone(raw, countryCode);
  if (!local) return "";
  const code = String(countryCode || "+91").trim() || "+91";
  const codeNorm = code.startsWith("+") ? code : `+${digitsOnly(code) || "91"}`;
  return `${codeNorm}${local}`;
}
