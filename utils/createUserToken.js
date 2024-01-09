const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET } = process.env;

const createUserToken = (id, expiresIn) => {
  const payload = {
    id,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

module.exports = createUserToken;
