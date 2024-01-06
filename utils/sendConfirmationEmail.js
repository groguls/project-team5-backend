const sendEmail = require("./sendEmail");
require("dotenv").config();

const { BASE_URL_FRONTEND } = process.env;

const sendConfirmationEmail = async (email, id) => {
  const confirmationEmail = {
    to: email,
    subject: "Confirmation email",
    html: `<a target='_blank' href='${BASE_URL_FRONTEND}/settings/password?id=${id}'>Click to change the password</a>`,
  };

  await sendEmail(confirmationEmail);
};

module.exports = sendConfirmationEmail;
