const {
  singupUserService,
  singinUserService,
  logoutUserService,
  updateAvatarUserService,
  settingsUserService,
  updateWaterRateUserService,
  sendConfirmationEmailService,
  changePasswordService,
} = require("./userServices");
const {
  getTodayWaterService,
  getMonthWaterService,
  addWaterService,
  editWaterService,
  deleteWaterService,
} = require("./waterServices");

module.exports = {
  singupUserService,
  singinUserService,
  logoutUserService,
  updateAvatarUserService,
  settingsUserService,
  updateWaterRateUserService,
  sendConfirmationEmailService,
  changePasswordService,
  getTodayWaterService,
  getMonthWaterService,
  addWaterService,
  editWaterService,
  deleteWaterService,
};
