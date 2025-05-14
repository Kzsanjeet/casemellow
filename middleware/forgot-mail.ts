import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service
    auth: {
      user: process.env.NODE_MAILER_EMAIL as string,
      pass: process.env.NODE_MAILER_PASSWORD as string,
    },
  });

const passwordResetMail = async (email:string, token:string) => {
    const mailOptions = {
      from: `Casemellow <${process.env.NODE_MAILER_EMAIL}>`,
      to: email,
      subject: 'Password Reset Request - Casemellow',
      html: `
       <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Password Reset - Casemellow</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f2f4f8;
          color: #333333;
        }

        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .header {
          background-color: #b82e29;
          padding: 24px 30px;
          text-align: center;
        }

        .header h1 {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
          font-weight: 600;
        }

        .content {
          padding: 40px 30px;
        }

        .content h2 {
          color: #b82e29;
          font-size: 22px;
          margin-bottom: 16px;
        }

        .content p {
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .button-wrapper {
          text-align: center;
          margin: 30px 0;
        }

        .button {
          background-color: #af281e;
          color: #ffffff;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 6px;
          font-weight: bold;
          font-size: 16px;
          transition: background-color 0.3s ease;
          display: inline-block;
        }

        .button:hover {
          background-color: #911f18;
        }

        .footer {
          text-align: center;
          padding: 20px 30px;
          font-size: 12px;
          color: #999999;
          background-color: #fafafa;
          border-top: 1px solid #eaeaea;
        }

        @media (max-width: 600px) {
          .content, .footer {
            padding: 20px;
          }

          .button {
            padding: 12px 20px;
            font-size: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>Casemellow</h1>
        </div>

        <!-- Main Content -->
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Dear User,</p>
          <p>We received a request to reset your password. To proceed, click the button below. If you didn’t request a password reset, you can safely ignore this email.</p>

          <div class="button-wrapper">
            <a href="${process.env.NEXT_BASE_URL}/reset-password?t=${token}" class="button">Reset Password</a>
          </div>

          <p>This link will expire in 5 minutes for your security.</p>
          <p>Thank you,<br/>The Casemellow Team</p>
        </div>

        <!-- Footer -->
        <div class="footer">
          © ${new Date().getFullYear()} Casemellow. All rights reserved.
        </div>
      </div>
    </body>
    </html>

    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        reject(error);
    } else {
        resolve(info);
    }
    });
});
};

export default passwordResetMail