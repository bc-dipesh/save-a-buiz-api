import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

const sendEmail = async ({
  subject,
  email: recipient,
  name,
  intro,
  instructions,
  link,
  text,
  color,
  outro,
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // create email template
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      // this will appear in header and footer of email
      name: 'SaveABuiz',
      link: 'https://angry-lalande-da8a76.netlify.app/',
    },
  });

  // generate email
  const email = {
    body: {
      name,
      intro,
      action: {
        instructions,
        button: {
          color,
          text,
          link,
        },
      },
      outro,
    },
  };

  // generate an HTML email with the config provided above
  const emailBody = mailGenerator.generate(email);

  // generate a plaintext version of the email (for clients that do not support HTML)
  const emailText = mailGenerator.generatePlaintext(email);

  // send the email
  await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: recipient,
    subject,
    html: emailBody,
    text: emailText,
  });
};

export default sendEmail;
