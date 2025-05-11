import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD
  }
});

const verifyEmailMail = async (email:string, token:string) => {
    const mailOptions = {
      from: `Casemellow <${process.env.NODE_MAILER_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email - Casemellow',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Email Verification - Casemellow</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333333;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 30px 0;">
              <table align="center" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden; margin: 0 auto;">
                
                <!-- Header with Title -->
                <tr>
                  <td style="background-color: #FF0000; padding: 25px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px;">Casemellow</h1>
                  </td>
                </tr>

                <!-- Main content -->
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <h2 style="color: #FF0000; font-size: 24px; margin-bottom: 20px;">Verify Your Email</h2>

                    <p style="font-size: 16px; margin-bottom: 20px;">Dear User,</p>
                    <p style="font-size: 16px; margin-bottom: 25px;">Thanks for signing up with <strong>Casemellow</strong>! Please verify your email address to activate your account:</p>

                    <a href="${process.env.NEXT_BASE_URL}/verify-email?t=${token}" style="display: inline-block; background-color: #FF0000; color: #ffffff; padding: 14px 30px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; margin-bottom: 30px;">Verify Email</a>

                    <p style="font-size: 14px; color: #555; margin-top: 40px;">Didn’t request this? Just ignore this email.</p>
                    <p style="font-size: 14px; color: #555;">Note: This link will expire shortly for your security.</p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f1f1f1; text-align: center; padding: 20px; font-size: 12px; color: #888;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Casemellow. All rights reserved.</p>
                    <p style="margin: 5px 0 0;">Kathmandu, Nepal</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
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
  }
  );
  };

  


  export default verifyEmailMail;