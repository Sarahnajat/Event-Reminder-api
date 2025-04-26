import nodemailer from "nodemailer";

const sendEmail = async options => {
  // Create a transporter with nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  //  Define the email options 
  const mailOptions = {
    //Replace it with your own email or your custom domain
    from: `sarah  <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // send the email
  await transporter.sendMail(mailOptions);
};


export default sendEmail;