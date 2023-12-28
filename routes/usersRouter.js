const express = require("express");
const {
  signup,
  signin,
  getCurrent,
  logout,
  updateAvatar,
  settings,
  updateWaterRate,
} = require("../controllers/usersControllers");
const { validateData } = require("../utils");
const { authVerification, isEmptyBody, upload } = require("../middlewares");
const {
  userSignupSchema,
  userSigninSchema,
  userSettingsSchema,
  userUpdateWaterRateSchema,
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

authRouter.patch(
  "/settings",
  authVerification,
  validateData(userSettingsSchema),
  settings
);

authRouter.patch(
  "/waterRate",
  authVerification,
  validateData(userUpdateWaterRateSchema),
  updateWaterRate
);

module.exports = authRouter;
