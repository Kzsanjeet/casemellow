import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD
  }
});

const sendOrderConfirmationMail = async (email: string, orderId: string) => {
    const mailOptions = {
      from: `Casemellow <${process.env.NODE_MAILER_EMAIL}>`,
      to: email,
      subject: 'Order Confirmation - Casemellow',
      html: `
       <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Order Confirmation - Casemellow</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #000000;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 30px 0;">
              <table align="center" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #FF0000; padding: 25px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px;">Casemellow</h1>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <h2 style="color: #FF0000; margin-bottom: 15px; font-size: 24px;">Your Order is Confirmed!</h2>
                    <p style="font-size: 17px; margin-bottom: 25px;">Thank you for choosing <strong>Casemellow</strong> 🎉</p>

                    <p style="font-size: 16px; margin-bottom: 5px;">Order ID:</p>
                    <p style="font-size: 20px; font-weight: bold; color: #FF0000; margin-bottom: 30px;">${orderId}</p>

                    <a href="${process.env.NEXT_BASE_URL}/order" style="display: inline-block; background-color: #FF0000; color: #ffffff; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">Track Your Order</a>

                    <p style="margin-top: 40px; font-size: 14px; color: #555;">Need help? Our support team is just a message away.</p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f1f1f1; text-align: center; padding: 20px; font-size: 12px; color: #888;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Casemellow. All rights reserved.</p>
                    <p style="margin: 4px 0 0;">Kathmandu, Nepal</p>
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
    });
  };

  export default sendOrderConfirmationMail;
  