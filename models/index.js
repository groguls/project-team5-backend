const {
  User,
  userAuthSchema,
  userSettingsSchema,
  userConfirmationEmailSchema,
  userUpdateWaterRateSchema,
  userChangePasswordSchema,
} = require("./User");
const { WaterNote, addWaterSchema, editWaterSchema } = require("./Water");

module.exports = {
  User,
  userAuthSchema,
  userSettingsSchema,
  userConfirmationEmailSchema,
  userUpdateWaterRateSchema,
  userChangePasswordSchema,
  WaterNote,
  addWaterSchema,
  editWaterSchema,
};
