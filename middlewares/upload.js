const multer = require("multer");
const path = require("path");

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const filename = `${req.user._id}_${file.originalname}`;

    cb(null, filename);
  },
});

const limits = {
  fileSize: 5 * 1048576,
};

const upload = multer({
  storage,
  limits,
});

module.exports = upload;
