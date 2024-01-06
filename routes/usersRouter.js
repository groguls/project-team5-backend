const express = require("express");
const {
  signup,
  signin,
  getCurrent,
  logout,
  updateAvatar,
  settings,
  updateWaterRate,
  sendConfirmationEmail,
  changePassword,
} = require("../controllers");
const { validateData } = require("../utils");
const { authVerification, isEmptyBody, upload } = require("../middlewares");
const {
  userAuthSchema,
  userSettingsSchema,
  userUpdateWaterRateSchema,
  userConfirmationEmailSchema,
  userChangePasswordSchema,
} = require("../models");

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, validateData(userAuthSchema), signup);

authRouter.post("/signin", isEmptyBody, validateData(userAuthSchema), signin);

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

authRouter.post(
  "/settings/forgotPassword",
  validateData(userConfirmationEmailSchema),
  sendConfirmationEmail
);

authRouter.patch(
  "/settings/password/:id",
  validateData(userChangePasswordSchema),
  changePassword
);

module.exports = authRouter;
