/** 숫자만 남긴다. 국제번호 '+'는 유지. */
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/\D/g, "");
}

/** 한국 번호를 010-1234-5678 형태로 보기 좋게 만든다. 그 외는 그대로. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (raw.startsWith("+")) return raw;
  if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  if (digits.length === 10) {
    if (digits.startsWith("02")) return digits.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  if (digits.length === 9 && digits.startsWith("02")) {
    return digits.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  if (digits.length === 8) return digits.replace(/(\d{4})(\d{4})/, "$1-$2");
  return raw;
}

export function isValidPhone(normalized: string): boolean {
  const digits = normalized.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}
