import nodemailer from "nodemailer";
import "dotenv/config";

// Create the transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_MAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

/**
 * Send OTP email to user
 * @param {string} to - Recipient email
 * @param {string} otp - One-time password
 */
export const mailer = async (to, otp) => {
  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Your OTP</title>
    <style>
      @media only screen and (max-width: 600px) {
        .container { width: 100% !important; padding: 16px !important; }
        .otp { font-size: 28px !important; letter-spacing: 6px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:600px;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(20,20,40,0.08);">
            <tr>
              <td style="padding:28px 36px 12px 36px;text-align:left;">
                <h1 style="margin:0;font-size:20px;color:#0f1724;">Your One-Time Passcode (OTP)</h1>
                <p style="margin:8px 0 0 0;color:#475569;font-size:14px;line-height:1.4;">
                  Use the code below to complete your sign in. This code is valid for <strong>10 minutes</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px;text-align:center;">
                <div style="display:inline-block;background:#f8fafc;border-radius:10px;padding:18px 28px;">
                  <p style="margin:0 0 10px 0;font-size:13px;color:#6b7280;">One-time passcode</p>
                  <div class="otp" style="font-family: 'Courier New', Courier, monospace;font-size:34px;letter-spacing:8px;color:#0b1220;font-weight:700;">
                    ${otp}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 36px 28px 36px;text-align:left;">
                <p style="margin:0 0 12px 0;color:#374151;font-size:13px;line-height:1.5;">
                  If you didn't request this code, you can safely ignore this email.
                </p>
                <a href="http://mukhtasar.com/api/auth/verify?otp=${otp}" style="display:inline-block;text-decoration:none;padding:10px 16px;border-radius:8px;background:#0b74ff;color:#ffffff;font-weight:600;font-size:13px;">
                  Verify now
                </a>
                <p style="margin-top:8px;font-size:12px;color:#9ca3af;">Expires in 10 minutes</p>
              </td>
            </tr>
          </table>
          <p style="margin-top:12px;font-size:11px;color:#9aa4b2;">This email was sent to ${to}.</p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Mukhtasar Karimjonova" <${process.env.GOOGLE_MAIL}>`,
      to,
      subject: "Your OTP Code",
      html,
    });
    return info;
  } catch (err) {
    console.log("Mailer Error:", err.message);
    throw new Error(err);
  }
};

/**
 * Send Order Status email to user
 * @param {string} to - Recipient email
 * @param {string} message - Status message
 */
export const orderMailer = async (to, message) => {
  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Order Status</title>
    <style>
      @media only screen and (max-width: 600px) {
        .container { width: 100% !important; padding: 16px !important; }
        .status { font-size: 28px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:600px;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(20,20,40,0.08);">
            <tr>
              <td style="padding:28px 36px 12px 36px;text-align:left;">
                <h1 style="margin:0;font-size:20px;color:#0f1724;">Your Order Status</h1>
                <p style="margin:8px 0 0 0;color:#475569;font-size:14px;line-height:1.4;">
                  The current status of your order:
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px;text-align:center;">
                <div style="display:inline-block;background:#f8fafc;border-radius:10px;padding:18px 28px;">
                  <p style="margin:0 0 10px 0;font-size:13px;color:#6b7280;">ORDER STATUS</p>
                  <div class="status" style="font-family: 'Courier New', Courier, monospace;font-size:34px;letter-spacing:8px;color:#0b1220;font-weight:700;">
                    ${message}
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <p style="margin-top:12px;font-size:11px;color:#9aa4b2;">This email was sent to ${to}.</p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Mukhtasar Karimjonova" <${process.env.GOOGLE_MAIL}>`,
      to,
      subject: "Your Order Status",
      html,
    });
    return info;
  } catch (err) {
    console.log("Order Mailer Error:", err.message);
    throw new Error(err);
  }
};
