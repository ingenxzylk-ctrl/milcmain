export function normalizeIndianPincode(raw) {
  return String(raw ?? "").replace(/\D/g, "").slice(0, 6);
}

export function isValidIndianPincode(raw) {
  return /^[1-9][0-9]{5}$/.test(normalizeIndianPincode(raw));
}

export function extractIndianPincode(raw) {
  const text = String(raw ?? "");
  const spaced = text.match(/\b([1-9]\d{2})\s*(\d{3})\b/);
  if (spaced) {
    const pin = `${spaced[1]}${spaced[2]}`;
    if (isValidIndianPincode(pin)) return pin;
  }
  const match = text.match(/\b([1-9][0-9]{5})\b/);
  return match && isValidIndianPincode(match[1]) ? match[1] : "";
}
