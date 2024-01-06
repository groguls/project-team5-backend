const HttpError = require("./HttpError");

const handleNotFoundId = (result, id) => {
  if (!result) {
    throw new HttpError(400, `${id} not found`);
  }
};

module.exports = handleNotFoundId;
