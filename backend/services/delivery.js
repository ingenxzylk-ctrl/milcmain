import nodemailer from "nodemailer";

function frontendBase() {
  return String(process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
}

export function reportUrl(reportId) {
  return `${frontendBase()}/?report=${encodeURIComponent(reportId)}`;
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendReportEmail({ aboutMe, reportId, headline }) {
  if (!smtpConfigured() || !aboutMe?.email) {
    return { sent: false, reason: smtpConfigured() ? "no_email" : "smtp_not_configured" };
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const url = reportUrl(reportId);
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: aboutMe.email,
    subject: `${aboutMe.fullName || "Your"} MILC skin report is ready`,
    text: `Hi ${aboutMe.fullName || "there"},\n\n${headline || "Your skin analysis is ready."}\n\nOpen your full report: ${url}\n\nPhotos were not retained after analysis.\n`,
  });
  return { sent: true, url };
}

export function whatsappShareUrl({ aboutMe, reportId }) {
  const digits = String(aboutMe?.whatsapp || "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  const cc = String(aboutMe?.countryCode || "+91").replace(/\D/g, "") || "91";
  const local = digits.slice(-10);
  const url = reportUrl(reportId);
  const text = `Your MILC skin report is ready: ${url}`;
  return `https://wa.me/${cc}${local}?text=${encodeURIComponent(text)}`;
}
