const express = require("express");
const {
  signup,
  signin,
  getCurrent,
  logout,
  updateAvatar,
} = require("../controllers/usersControllers");
const { validateData } = require("../utils");
const { authVerification, isEmptyBody, upload } = require("../middlewares");
const {
  userSignupSchema,
  userSigninSchema,
  userUpdateSchema,
} = require("../schemes");

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, validateData(userSignupSchema), signup);

authRouter.post("/signin", isEmptyBody, validateData(userSigninSchema), signin);

authRouter.get("/current", authVerification, getCurrent);

authRouter.post("/logout", authVerification, logout);

authRouter.patch(
  "/avatars",
  authVerification,
  upload.single("avatarURL"),
  updateAvatar
);

module.exports = authRouter;
