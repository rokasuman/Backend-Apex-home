import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email Sent:", info.response);
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;