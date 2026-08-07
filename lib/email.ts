import 'server-only';

export const EMAIL_CONFIGURED = !!process.env.RESEND_API_KEY;

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'DOXA Social <onboarding@resend.dev>';

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends through Resend's REST API — no SDK dependency needed.
 * Never throws: Better Auth runs sendResetPassword in the background, so a rejection
 * there surfaces as an opaque 500 instead of a useful error.
 */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<boolean> {
  if (!EMAIL_CONFIGURED) {
    console.warn('[email] RESEND_API_KEY is not set — skipping send to', to);
    return false;
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || DEFAULT_FROM,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      console.error('[email] Resend rejected the send', response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('[email] Failed to reach Resend', error);
    return false;
  }
}

const BRAND_PURPLE = '#7851A9';
const BRAND_DARK = '#19003a';

export function resetPasswordEmail(displayName: string, url: string) {
  const greeting = displayName?.trim() ? `Hi ${escapeHtml(displayName.trim())},` : 'Hi,';

  return `
<div style="background:${BRAND_DARK};padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:20px;padding:36px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND_PURPLE};">DOXA Social</p>
    <h1 style="margin:0 0 20px;font-size:22px;color:${BRAND_DARK};">Reset your password</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">${greeting}</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#334155;">
      We received a request to reset the password on your DOXA Social account. Click the button below to choose a new one. This link expires in one hour.
    </p>
    <a href="${url}" style="display:inline-block;background:${BRAND_PURPLE};color:#ffffff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:999px;font-size:15px;">Reset password</a>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#64748b;">
      If you didn't request this, you can safely ignore this email — your password won't change.
    </p>
    <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#94a3b8;word-break:break-all;">
      Or paste this link into your browser:<br />${url}
    </p>
  </div>
  <p style="max-width:480px;margin:20px auto 0;text-align:center;font-size:12px;color:#ffffff;opacity:0.6;">
    Made by DOXA Innovations PLC
  </p>
</div>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
