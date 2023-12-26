const HttpError = require("./HttpError");

const handleNotFoundId = (result, id) => {
  if (!result) {
    throw new HttpError(400, `ID ${id} not found`);
  }
};

module.exports = handleNotFoundId;
