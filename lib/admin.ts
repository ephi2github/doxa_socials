import "server-only";

/**
 * Admin access is granted only to addresses listed in ADMIN_EMAIL.
 * Accepts a single address or a comma-separated list. Fails closed: if the variable is
 * unset or empty, nobody is an admin.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return false;

  return adminEmails.includes(email.trim().toLowerCase());
}
