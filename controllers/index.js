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
} = require("./usersControllers");
const {
  getTodayWater,
  getMonthWater,
  addWater,
  editWater,
  deleteWater,
} = require("./waterControllers");

module.exports = {
  signup,
  signin,
  getCurrent,
  logout,
  updateAvatar,
  settings,
  updateWaterRate,
  sendConfirmationEmail,
  changePassword,
  getTodayWater,
  getMonthWater,
  addWater,
  editWater,
  deleteWater,
};
