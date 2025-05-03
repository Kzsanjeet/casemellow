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
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Casemellow</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              color: #333333;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background-color:rgb(184, 46, 41);
              padding: 20px 30px;
              text-align: center;
            }
            .header img {
              max-width: 180px;
              height: auto;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color:rgb(175, 35, 30);
              font-size: 24px;
              margin-bottom: 20px;
            }
            .content p {
              font-size: 16px;
              margin-bottom: 20px;
            }
            .button-wrapper {
              text-align: center;
              margin: 30px 0;
              color:rgb(255, 255, 255);
            }
            .button {
              background-color:rgb(175, 40, 30);
              color:rgb(255, 255, 255);
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-weight: bold;
              font-size: 16px;
              display: inline-block;
            }
            .footer {
              text-align: center;
              padding: 20px 30px;
              font-size: 12px;
              color: #999999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            
            <!-- Logo Header -->
            <div class="header">
             <h1 classname ="text-white">Casemellow</h1>
            </div>
            
            <!-- Main Content -->
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Dear User,</p>
              <p>We received a request to reset your password. To proceed, please click the button below. If you did not request a password reset, you can safely ignore this email.</p>
              
              <div class="button-wrapper">
                <a href="${process.env.NEXT_BASE_URL}/reset-password?t=${token}" class="button">Reset Password</a>
              </div>
              
              <p>This link will expire in 5 min for your security.</p>
              <p>Thank you,<br>Casemellow Team</p>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              © ${new Date().getFullYear()} Guide
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