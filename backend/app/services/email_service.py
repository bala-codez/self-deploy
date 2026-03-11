import resend
from app.core.config import settings


resend.api_key = settings.RESEND_API_KEY


class EmailService:

    def _build_otp_html(self, otp: str, action: str = "verify your email") -> str:
        return f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:0;background:#080c12;font-family:'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#080c12;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0"
                       style="background:#0e1521;border:1px solid #1c2e45;border-radius:16px;padding:40px 36px;">
                  <tr>
                    <td>
                      <h1 style="margin:0 0 4px;color:#dde8f8;font-size:22px;font-weight:700;">
                        Self <span style="color:#38bdf8;">Deploy</span>
                      </h1>
                      <p style="margin:0 0 32px;color:#6e8aaa;font-size:13px;">
                        Your self-hosted platform
                      </p>

                      <p style="margin:0 0 16px;color:#dde8f8;font-size:15px;">
                        Please use the code below to {action}:
                      </p>

                      <div style="background:#0b1220;border:1px dashed #243650;border-radius:12px;
                                  padding:24px;text-align:center;margin:0 0 24px;">
                        <span style="font-size:38px;font-weight:700;letter-spacing:10px;color:#38bdf8;
                                     font-family:'Courier New',monospace;">{otp}</span>
                      </div>

                      <p style="margin:0 0 8px;color:#6e8aaa;font-size:13px;">
                        This code expires in <strong style="color:#dde8f8;">
                        {settings.OTP_EXPIRE_MINUTES} minutes</strong>.
                      </p>
                      <p style="margin:0;color:#3a5070;font-size:12px;">
                        If you did not request this, please ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """

    def send_email(self, email: str, subject: str, html_body: str, text_body: str = "") -> None:
        try:
            resend.Emails.send({
                "from": settings.EMAIL_FROM,
                "to": email,
                "subject": subject,
                "html": html_body,
                "text": text_body
            })

            logger.info("Email sent to %s | subject=%s", email, subject)

        except Exception as exc:
            logger.error("Failed to send email to %s: %s", email, exc)
            raise

    def send_otp_email(self, email: str, otp: str, action: str = "verify your email") -> None:
        subject = f"Your {settings.APP_NAME} verification code"
        html = self._build_otp_html(otp, action)
        text = f"Your OTP code is: {otp}\nIt expires in {settings.OTP_EXPIRE_MINUTES} minutes."
        self.send_email(email, subject, html, text)