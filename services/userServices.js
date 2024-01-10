const bcrypt = require("bcryptjs");
const fs = require("fs/promises");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const {
  HttpError,
  createUserToken,
  sendConfirmationEmail,
  handleNotFoundId,
  cloudinary,
} = require("../utils");
require("dotenv").config();

const { JWT_SECRET } = process.env;

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

  const token = createUserToken(newUser._id, "7d");
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

  const token = createUserToken(user._id, "7d");
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

  const { path } = file;

  const { secure_url: avatarURL } = await cloudinary.uploader.upload(path, {
    folder: "avatars",
    width: 80,
    height: 80,
  });

  await fs.unlink(path);

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

  const confirmationToken = createUserToken(user._id, "15m");
  user.tempConfirmationToken = confirmationToken;
  user.save();

  sendConfirmationEmail(email, confirmationToken);
};

const changePasswordService = async (tempConfirmationToken, newPassword) => {
  const user = await User.findOne({ tempConfirmationToken });

  if (!user) {
    throw new HttpError(400, "Confirmation token is invalid");
  }

  try {
    const { id } = jwt.verify(tempConfirmationToken, JWT_SECRET);
    const user = await User.findById(id);

    if (!user || user.tempConfirmationToken !== tempConfirmationToken) {
      new HttpError(400, "Confirmation token invalid");
    }
  } catch (err) {
    throw new HttpError(400, "Confirmation token is invalid");
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashPassword;
  user.tempConfirmationToken = null;
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
