import nodemailer from "nodemailer";

async function sendLoginNotification(to, subject, html) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USE,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USE,
      to,
      subject,
      html,
    });

    console.log("Email enviado:", info.response);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
}

export { sendLoginNotification };
