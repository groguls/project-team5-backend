const express = require("express");
const authVerification = require("../middlewares/authVerification");
const { validateData } = require("../utils");
const {
  getTodayWater,
  addWater,
  deleteWater,
  editWater,
  getMonthWater,
} = require("../controllers");

const waterRouter = express.Router();

waterRouter
  .route("/")
  .all(authVerification)
  .get(getTodayWater)
  .post(validateData(), addWater);

waterRouter
  .route("/:recordId")
  .all(authVerification)
  .delete(deleteWater)
  .patch(editWater);

waterRouter.get("/:month", authVerification, getMonthWater);

module.exports = waterRouter;
