import nodemailer from "nodemailer";
import { NetworkError } from "utils/errors/error";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USE,
    pass: process.env.EMAIL_PASS,
  },
});
async function sendEmailNotification(to, subject, html) {
  if (
    process.env.APP_EMAIL === "test" ||
    process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV === "development"
  ) {
    return true;
  }

  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USE,
      to,
      subject,
      html,
    });

    console.log("Email enviado:", info.response);
    return null;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw new NetworkError([
      {
        field: "sendEmail",
        message: "failed to send email to user",
      },
    ]);
  }
}

export { sendEmailNotification };
