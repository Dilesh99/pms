export const validators = {
  required(value: string, label = "This field") {
    return value.trim() ? undefined : `${label} is required.`;
  },
  email(value: string) {
    if (!value.trim()) return "Email address is required.";
    // Simple, permissive email pattern
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
      ? undefined
      : "Enter a valid email address, e.g. name@example.com.";
  },
  phone(value: string) {
    if (!value.trim()) return "Phone number is required.";
    return /^[+]?[\d\s()-]{7,}$/.test(value.trim())
      ? undefined
      : "Enter a valid phone number (at least 7 digits).";
  },
  password(value: string) {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value))
      return "Password must include at least one letter and one number.";
    return undefined;
  },
  minLength(value: string, min: number, label = "This field") {
    if (!value.trim()) return `${label} is required.`;
    return value.trim().length >= min ? undefined : `${label} must be at least ${min} characters.`;
  },
  pastDate(value: string, label = "Date") {
    if (!value) return `${label} is required.`;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Enter a valid date.";
    return d < new Date() ? undefined : `${label} must be in the past.`;
  },
};

/** Password strength meter: 0–4 with a label. */
export function passwordStrength(value: string): { score: number; label: string } {
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}
