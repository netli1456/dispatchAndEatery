import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

export const sendVerificationEmail = async({ user, subject, text, warning, res }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const saltRounds = 10;
  let otp = '';
  const characters = '0123456789';
  for (let i = 0; i < 6; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  let hashOtp = bcrypt.hashSync(otp, saltRounds);
  console.log(otp);

  const mailOptions = {
    from: process.env.USER,
    to: user.email,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .header {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            margin-bottom: 20px;
          }
          .subheading {
            font-size: 20px;
            font-weight: normal;
            color: #555555;
            margin-bottom: 20px;
          }
          .verification-code {
            font-size: 30px;
            font-weight: bold;
            color: #ff6347;
            margin: 20px 0;
          }
          .message {
            font-size: 16px;
            color: #777777;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">M-bite Verification Code</div>
          <div class="subheading">Confirmation</div>
          <div class="message"> ${text}</div>
          <div class="verification-code">${otp}</div>
          
          <div class="message">${warning}</div>
        </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return error
    }
  });

  return hashOtp;
};


