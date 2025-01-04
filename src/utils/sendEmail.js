import nodemailer from "nodemailer"

const smtpTransport = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.NODEMAILER_ZOHO_MAIL_USER, // Your Gmail username
    pass: process.env.NODEMAILER_ZOHO_MAIL_PASS, // Your Gmail password or app password
  },
});

// Utility Function to Send Email
export const sendEmail = async (from, to, name, message) => {
  try {
    const mailOptions = {
      from, // Sender email address
      to, // Recipient email address
      subject: `${name} | New Message!`, // Email subject
      text: message, // Email content
      dsn: {
          id: 'some random message specific id',
          return: 'headers',
          notify: ['failure', 'delay'],
          recipient: from
      }
    };

    const result = await smtpTransport.sendMail(mailOptions,
      (err, res) => {
        if (err) console.error(err);
        console.log(res);
      }
    );
    console.log('Email sent successfully:', result);
    return result; // Return result for further handling if needed
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Rethrow the error to handle it in calling functions
  }
};