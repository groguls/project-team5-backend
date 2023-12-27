const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { User } = require("../models/index.js");
const { HttpError, decorateConrtoller } = require("../utils/index.js");
const createUserToken = require("../helpers/createUserToken.js");

const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = "";

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  const { _id, waterRate } = await User.findOne({ email });

  const token = createUserToken(_id);

  await User.findByIdAndUpdate(_id, { token });

  res.status(201).json({
    token,
    user: {
      email: newUser.email,
      avatarURL,
      waterRate,
    },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const token = createUserToken(user._id);

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email,
      avatarURL: user.avatarURL,
      waterRate: user.waterRate,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, avatarURL, waterRate } = req.user;

  res.json({ email, avatarURL, waterRate });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).send();
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw new HttpError(400, "Missing required avatarURL");
  }

  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const avatarPath = path.resolve("public", "avatars");

  await Jimp.read(oldPath)
    .then((file) => {
      return file.resize(80, 80).write(oldPath);
    })
    .catch((error) => console.log(error.message));

  const newPath = path.join(avatarPath, filename);

  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, {
    avatarURL,
  });

  res.json({
    avatarURL,
  });
};

const settings = async (req, res) => {
  const { body, user } = req;

  const updatedUser = await User.findByIdAndUpdate(user._id, body);

  res.json(updatedUser);
};

module.exports = {
  signup: decorateConrtoller(signup),
  signin: decorateConrtoller(signin),
  getCurrent: decorateConrtoller(getCurrent),
  logout: decorateConrtoller(logout),
  updateAvatar: decorateConrtoller(updateAvatar),
  settings: decorateConrtoller(settings),
};
