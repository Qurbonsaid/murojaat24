/** API format: +998XXXXXXXXX (no spaces). */
export const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const normalized = digits.startsWith("998") ? digits.slice(3) : digits;
  return normalized ? `+998${normalized}` : "";
};

/** Display format: +998 90 123 45 67 */
export const formatPhoneInput = (value: string) => {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("998")) {
    digits = digits.slice(3);
  }
  if (digits.length > 9) {
    digits = digits.slice(0, 9);
  }

  if (!digits) return "";
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);
  return `+998 ${parts.join(" ")}`.trim();
};
