const sendEmail = require("./sendEmail");
require("dotenv").config();

const { BASE_URL_FRONTEND, UKR_NET_EMAIL } = process.env;

const sendConfirmationEmail = async (email, confirmationToken) => {
  const confirmationEmail = {
    to: email,
    subject: "Confirmation email",
    html: `<p>To change your password, follow the link:<br><a target='_blank' href='${BASE_URL_FRONTEND}/settings/password/${confirmationToken}'>Click to change the password</a>.<br>This link is valid for 15 minutes.<br>If you did not make the request to change your password, please contact us by email <a href='mailto:${UKR_NET_EMAIL}'>${UKR_NET_EMAIL}</a>.</p>`,
  };

  await sendEmail(confirmationEmail);
};

module.exports = sendConfirmationEmail;
