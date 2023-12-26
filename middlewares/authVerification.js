const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { HttpError, decorateConrtoller } = require("../utils");

const authVerification = decorateConrtoller(async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];

  if (!authorization || !authorization.startsWith("Bearer ") || !token) {
    throw new HttpError(401, "Not authorized");
  }

  const { JWT_SECRET } = process.env;

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
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
