import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from 'dotenv';
dotenv.config();

const OAuth2 = google.auth.OAuth2;
const OAuth2_Client = new OAuth2(
  process.env.CLIENT_ID, 
  process.env.CLIENT_SECRET, 
  process.env.REDIRECT_URL
);
OAuth2_Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

export const sendOTPToEmail = async (userEmail, data) => {
  try {
    const accessTokenResponse = await OAuth2_Client.getAccessToken();
    const accessToken = accessTokenResponse.token;
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    const mailOptions = {
      from: `RASI TRADERS <${process.env.MAIL}>`,
      to: userEmail,
      subject: 'Order Placed',
      text: data
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);

    transporter.close();
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


