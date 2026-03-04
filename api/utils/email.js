import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function getBaseUrl() {
  return process.env.CLIENT_URL || "http://localhost:5173";
}

export async function sendVerificationEmail(email, token) {
  const link = `${getBaseUrl()}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"AmizEstate" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email — AmizEstate",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
        <h2 style="color:#0e2240;margin:0 0 8px;">Welcome to AmizEstate!</h2>
        <p style="color:#64748b;font-size:15px;line-height:1.6;">
          Thanks for signing up. Please verify your email address by clicking the button below.
        </p>
        <a href="${link}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#0e2240;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:14px;">
          Verify Email
        </a>
        <p style="color:#94a3b8;font-size:13px;">
          This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email, token) {
  const link = `${getBaseUrl()}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"AmizEstate" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password — AmizEstate",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
        <h2 style="color:#0e2240;margin:0 0 8px;">Password Reset</h2>
        <p style="color:#64748b;font-size:15px;line-height:1.6;">
          We received a request to reset your password. Click the button below to create a new one.
        </p>
        <a href="${link}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#0e2240;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:14px;">
          Reset Password
        </a>
        <p style="color:#94a3b8;font-size:13px;">
          This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
