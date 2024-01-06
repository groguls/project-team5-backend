const bcrypt = require("bcryptjs");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");
const { User } = require("../models");
const {
  HttpError,
  createUserToken,
  sendConfirmationEmail,
} = require("../utils");

const singupUserService = async (credentials) => {
  const { email, password } = credentials;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = "";

  const newUser = await User.create({
    email,
    password: hashPassword,
    avatarURL,
  });

  const token = createUserToken(newUser._id);
  newUser.token = token;
  newUser.save();

  return {
    token,
    user: newUser,
  };
};

const singinUserService = async (credentials) => {
  const { email, password } = credentials;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const token = createUserToken(user._id);
  user.token = token;
  user.save();

  return {
    token,
    user,
  };
};

const logoutUserService = async (id) => {
  await User.findByIdAndUpdate(id, { token: "" });
};

const updateAvatarUserService = async (id, file) => {
  if (!file) {
    throw new HttpError(400, "Missing required avatarURL");
  }

  const { path: oldPath, filename } = file;

  await Jimp.read(oldPath)
    .then((file) => {
      return file.resize(80, 80).write(oldPath);
    })
    .catch((error) => console.log(error.message));

  const avatarPath = path.resolve("public", "avatars");
  const newPath = path.join(avatarPath, filename);

  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(id, { avatarURL });

  return avatarURL;
};

const settingsUserService = async (user, data) => {
  if (data.oldPassword && data.newPassword) {
    const passwordCompare = await bcrypt.compare(
      data.oldPassword,
      user.password
    );

    if (!passwordCompare) {
      throw new HttpError(401, "Password is wrong");
    }

    const newPasswordCompare = await bcrypt.compare(
      data.newPassword,
      user.password
    );

    if (newPasswordCompare) {
      throw new HttpError(400, "The password entered is your current password");
    }

    const hashPassword = await bcrypt.hash(data.newPassword, 10);

    delete data.oldPassword;
    delete data.newPassword;
    data.password = hashPassword;
  }

  const updatedUser = await User.findByIdAndUpdate(user._id, data);

  return updatedUser;
};

const updateWaterRateUserService = async (id, waterRate) => {
  await User.findByIdAndUpdate(id, { waterRate });
};

const sendConfirmationEmailService = async (email) => {
  const user = await User.findOne({ email });

  handleNotFoundId(user, email);

  sendConfirmationEmail(email, user._id);
};

const changePasswordService = async (id, newPassword) => {
  const user = await User.findById(id);

  handleNotFoundId(user, id);

  const hashPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashPassword;
  user.save();
};

module.exports = {
  singupUserService,
  singinUserService,
  logoutUserService,
  updateAvatarUserService,
  settingsUserService,
  updateWaterRateUserService,
  sendConfirmationEmailService,
  changePasswordService,
};
