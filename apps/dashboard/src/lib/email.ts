import nodemailer from "nodemailer";

export const emailConfigs = {
  gmail: {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },
};

export const generateOTPEmail = (userName: string, otp: string) => ({
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">Verification Required</h1>
        <p style="color: #666; font-size: 16px;">Please verify your identity to continue</p>
      </div>
      
      <div style="background: #f8f9fa; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0;">
        <p style="color: #333; font-size: 18px; margin-bottom: 20px;">
          Hi ${userName || "there"},
        </p>
        <p style="color: #666; margin-bottom: 30px;">
          Your verification code is:
        </p>
        <div style="background: white; border: 2px dashed #007bff; border-radius: 8px; padding: 25px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px;">
            ${otp}
          </span>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This code will expire in <strong>10 minutes</strong>
        </p>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          If you didn't request this verification code, please ignore this email.
          <br>
          For security reasons, do not share this code with anyone.
        </p>
      </div>
    </div>
  `,
  text: `
    Verification Code Required
    
    Hi ${userName || "there"},
    
    Your verification code is: ${otp}
    
    This code will expire in 10 minutes.
    
    If you didn't request this, please ignore this email.
    For security reasons, do not share this code with anyone.
  `,
});

// Email service class
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config = emailConfigs.smtp) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendOTP(userEmail: string, userName: string, otp: string) {
    try {
      const emailContent = generateOTPEmail(userName, otp);

      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || "noreply@wareflow.com",
        to: userEmail,
        subject: "Your Verification Code",
        ...emailContent,
      });

      console.log(`OTP email sent to ${userEmail}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      throw new Error("Failed to send verification code");
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("Email service connection verified");
      return true;
    } catch (error) {
      console.error("Email service connection failed:", error);
      return false;
    }
  }
}

export const emailService = new EmailService();
