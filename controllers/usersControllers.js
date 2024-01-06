const {
  singupUserService,
  singinUserService,
  logoutUserService,
  updateAvatarUserService,
  settingsUserService,
  updateWaterRateUserService,
  sendConfirmationEmailService,
  changePasswordService,
} = require("../services");
const { decorateConrtoller } = require("../utils");

const signup = decorateConrtoller(async (req, res) => {
  const { token, user } = await singupUserService(req.body);
  const { email, avatarURL, waterRate } = user;

  res.status(201).json({
    token,
    user: {
      email,
      avatarURL,
      waterRate,
    },
  });
});

const signin = decorateConrtoller(async (req, res) => {
  const { token, user } = await singinUserService(req.body);
  const { email, avatarURL, waterRate } = user;

  res.json({
    token,
    user: {
      email,
      avatarURL,
      waterRate,
    },
  });
});

const getCurrent = (req, res) => {
  const { email, name, avatarURL, waterRate } = req.user;

  res.json({ email, name, avatarURL, waterRate });
};

const logout = decorateConrtoller(async (req, res) => {
  const { _id } = req.user;

  await logoutUserService(_id);

  res.status(204).send();
});

const updateAvatar = decorateConrtoller(async (req, res) => {
  const { file, user } = req;
  const avatarURL = await updateAvatarUserService(user._id, file);

  res.json({
    avatarURL,
  });
});

const settings = decorateConrtoller(async (req, res) => {
  const { user, body } = req;
  const updatedUser = await settingsUserService(user, body);

  res.json(updatedUser);
});

const updateWaterRate = decorateConrtoller(async (req, res) => {
  const { _id } = req.user;
  const { waterRate } = req.body;

  await updateWaterRateUserService(_id, waterRate);

  res.json({ waterRate });
});

const sendConfirmationEmail = decorateConrtoller(async (req, res) => {
  const { email } = req.body;

  await sendConfirmationEmailService(email);

  res.json({
    message: "Confirmation email sent",
  });
});

const changePassword = decorateConrtoller(async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  await changePasswordService(id, newPassword);

  res.json({
    message: "Password successfully changed",
  });
});

module.exports = {
  signup,
  signin,
  getCurrent,
  logout,
  updateAvatar,
  settings,
  updateWaterRate,
  sendConfirmationEmail,
  changePassword,
};
