const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "mail.drimt.co",
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASSWORD || "",
  },
});

const sendConfirmationEmail = async (email, token, baseUrl, branchName) => {
  const origin = baseUrl || process.env.FRONTEND_URL || "http://localhost:5173";
  const branchPrefix = branchName ? `/${branchName}` : "";
  const confirmUrl = `${origin}${branchPrefix}/confirm-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Confirm your email - Lens",
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
          <tr><td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
              <tr><td style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 32px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Lens</h1>
              </td></tr>
              <tr><td style="padding: 40px 32px;">
                <h2 style="color: #1e293b; margin: 0 0 16px; font-size: 22px;">Confirm your email</h2>
                <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
                  Thank you for registering! Please click the button below to verify your email address and activate your account.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
                  <a href="${confirmUrl}" style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                    Confirm Email
                  </a>
                </td></tr></table>
                <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 32px 0 0; text-align: center;">
                  This link expires in 24 hours.
                </p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
                  If the button doesn't work, copy and paste this URL into your browser:<br/>
                  <a href="${confirmUrl}" style="color: #0ea5e9; word-break: break-all;">${confirmUrl}</a>
                </p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail, transporter };
