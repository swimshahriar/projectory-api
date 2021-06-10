import nodemailer from "nodemailer";
import { google } from "googleapis";

export const sendEmail = async (options) => {
  // oAuth client
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.CLIENT_REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const accessToken = await oAuth2Client.getAccessToken();

  // transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.NODE_MAILER_USERNAME,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  // email options
  const mailOptions = {
    from: "Projectory Admin <admin@projectory.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.message,
  };

  // send email
  await transporter.sendMail(mailOptions);
};
