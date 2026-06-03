import nodemailer from "nodemailer";
async function sendLoginNotification(to, subject, html) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USE,
    to: to,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return ({ error }, false);
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
}

export { sendLoginNotification };
