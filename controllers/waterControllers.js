const {
  getTodayWaterService,
  getMonthWaterService,
  addWaterService,
  editWaterService,
  deleteWaterService,
} = require("../services");
const { decorateConrtoller } = require("../utils");

const getTodayWater = decorateConrtoller(async (req, res) => {
  const result = await getTodayWaterService(req.user._id);
  res.json(result);
});

const getMonthWater = decorateConrtoller(async (req, res) => {
  const result = await getMonthWaterService(req.user._id, req.params.month);
  res.json(result);
});

const addWater = decorateConrtoller(async (req, res) => {
  const result = await addWaterService(req.user._id, req.body);
  res.status(201).json(result);
});

const editWater = decorateConrtoller(async (req, res) => {
  const result = await updateContactByIdService(
    req.user._id,
    req.params.recordId,
    req.body
  );
  res.json(result);
});

const deleteWater = decorateConrtoller(async (req, res) => {
  await deleteWaterService(req.user._id, req.params.recordId);
  res.json({ message: "Record deleted" });
});

module.exports = {
  getTodayWater,
  getMonthWater,
  addWater,
  editWater,
  deleteWater,
};
