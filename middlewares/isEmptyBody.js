const { HttpError } = require("../utils");

const isEmptyBody = async (req, res, next) => {
  const keys = Object.keys(req.body);

  if (!keys.length) {
    next(new HttpError(400, "missing fields"));
  }

  next();
};

module.exports = isEmptyBody;
