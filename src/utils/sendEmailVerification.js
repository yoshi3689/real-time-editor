import jwt from 'jsonwebtoken';
import { sendEmail } from './sendEmail'; // Adjust the path as needed

export const sendVerificationEmail = async ({ email, name }) => {
  // Generate the email verification token
  const emailVerificationToken = jwt.sign(
    { email },
    process.env.JWT_SECRET, // Access JWT_SECRET directly
    { expiresIn: '1h' } // Token expiration
  );

  // Determine the base URL
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${process.env.PORT}`
      : process.env.APP_URL_PROD;

  // Construct the verification URL
  const verificationUrlSuffix = `/account/verify-email?token=${emailVerificationToken}`
  const verificationUrl = `${baseUrl}` + verificationUrlSuffix;

  // Construct the email message
  const emailMessage = `Hi ${name},\n\nPlease verify your email by clicking the link below:\n\n${verificationUrl}\n\nThank you!`;

  // Send the email
  await sendEmail(
    process.env.NODEMAILER_ZOHO_MAIL_USER, // Access the sender email directly
    email,
    name,
    emailMessage
  );
};
