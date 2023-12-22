const jwt = require("jsonwebtoken");
const { HttpError, decorateConrtoller } = require("../utils");
const { User } = require("../models");

const authVerification = decorateConrtoller(async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];

  if (!authorization || !authorization.startsWith("Bearer ") || !token) {
    throw new HttpError(401, "Not authorized");
  }

  const { PRIVATE_KEY } = process.env;

  try {
    const { id } = jwt.verify(token, PRIVATE_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      throw new HttpError(401, "Not authorized");
    }
    req.user = user;

    next();
  } catch (error) {
    throw new HttpError(401, error.message);
  }
});

module.exports = authVerification;
