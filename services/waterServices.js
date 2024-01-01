const {
  set,
  formatISO,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
} = require("date-fns");
const { WaterNote, User } = require("../models");
const { handleNotFoundId } = require("../utils");

const getTodayWaterService = async (user) => {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  return await WaterNote.aggregate([
    {
      $match: {
        user,
        date: { $gte: todayStart, $lte: todayEnd },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $group: {
        _id: null,
        userId: { $first: "$user._id" },
        date: {
          $first: { $dateToString: { format: "%G-%m-%d", date: "$date" } },
        },
        totalWaterConsumed: { $sum: "$waterVolume" },
        dailyWaterRate: { $first: "$user.waterRate" },
        waterRecords: {
          $push: {
            _id: "$_id",
            waterVolume: "$waterVolume",
            time: { $dateToString: { format: "%H:%M", date: "$date" } },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        userId: 1,
        dailyWaterRate: 1,
        date: 1,
        percentage: {
          $concat: [
            {
              $toString: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$totalWaterConsumed", "$dailyWaterRate"] },
                      100,
                    ],
                  },
                  0,
                ],
              },
            },
            "%",
          ],
        },
        waterRecords: 1,
      },
    },
  ]);
};

const getMonthWaterService = async (user, date) => {
  const [year, month] = date.split("-").map(Number);
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(startDate);

  return await WaterNote.aggregate([
    {
      $match: {
        user,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $group: {
        _id: { $dateToString: { format: "%G-%m-%d", date: "$date" } },
        dailyWaterRate: { $first: "$user.waterRate" },
        totalWaterConsumed: { $sum: "$waterVolume" },
        entries: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        dailyWaterRate: {
          $concat: [
            { $toString: { $divide: ["$dailyWaterRate", 1000] } },
            " L",
          ],
        },
        percentage: {
          $concat: [
            {
              $toString: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$totalWaterConsumed", "$dailyWaterRate"] },
                      100,
                    ],
                  },
                  0,
                ],
              },
            },
            "%",
          ],
        },
        entries: 1,
      },
    },
  ]);
};

const addWaterService = async (user, newRecord) => {
  const { waterVolume, date } = newRecord;
  const dateWithUserTimeIso = formatTimeToIso(date);
  return await WaterNote.create({
    waterVolume,
    date: dateWithUserTimeIso,
    user,
  });
};

const editWaterService = async (user, record, newData) => {
  const editedRecord = await WaterNote.findOne({ _id: record, user });
  handleNotFoundId(editedRecord, record);

  const { waterVolume, date } = newData;

  if (waterVolume) {
    editedRecord.waterVolume = waterVolume;
  }
  if (date) {
    const dateWithUserTimeIso = formatTimeToIso(date);
    editedRecord.date = dateWithUserTimeIso;
    editedRecord.markModified("date");
  }

  return await editedRecord.save();
};

const deleteWaterService = async (user, record) => {
  const recordToDelete = await WaterNote.findOneAndDelete({
    _id: record,
    user,
  });
  handleNotFoundId(recordToDelete, record);
  return recordToDelete;
};

const formatTimeToIso = (date) => {
  const currentDate = new Date();
  const [hours, minutes] = date.split(":").map(Number);
  return formatISO(set(currentDate, { hours, minutes }));
};

module.exports = {
  getTodayWaterService,
  getMonthWaterService,
  addWaterService,
  editWaterService,
  deleteWaterService,
};
