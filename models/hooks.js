const preUpdateHook = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};

const handleSaveError = function (error, doc, next) {
  error.statusCode =
    error.code === 11000 && error.name === "MongoServerError" ? 409 : 400;
  next();
};

module.exports = { preUpdateHook, handleSaveError };
