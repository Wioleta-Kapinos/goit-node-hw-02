const User = require("./userSchema");
const nodemailer = require("nodemailer");
require ("dotenv").config();

const config = {
  host: "smtp.sendgrid.net",
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
};

const transporter = nodemailer.createTransport(config);

const sendVerificationEmail = async (userEmail, userToken) => {
    const serverURL = `${process.env.BASE_URL}:${process.env.APP_PORT}`;
    await User.findOneAndUpdate(
        { email: userEmail },
        { verificationToken: userToken },
        { new: true }
      );

    const emailOptions = {
        to: userEmail,
        from: process.env.SENDER_EMAIL,
        subject: "Email Verification",
        html: `<p>Click the link to verify your email: <a href="${serverURL}/api/users/verify/${userToken}">${serverURL}/api/users/verify/${userToken}</a></p>`,
    };

    transporter.sendMail(emailOptions)
    .then(info => console.log("Verification email sent"))
    .catch(error => console.log(error));
};

module.exports = { sendVerificationEmail };