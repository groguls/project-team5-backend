const {
  set,
  formatISO,
  startOfDay,
  endOfDay,
  addMonths,
  subMonths,
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
        _id: 0,
        percentage: {
          $concat: [
            {
              $toString: {
                $multiply: [
                  { $divide: [{ $sum: "$waterVolume" }, "$user.waterRate"] },
                  100,
                ],
              },
            },
            "%",
          ],
        },
        waterRecords: { $push: { waterVolume: "$waterVolume", date: "$date" } },
      },
    },
  ]);

  // return await WaterNote.find({
  //   user,
  //   date: { $gte: todayStart, $lte: todayEnd },
  // }).exec();
};

const getMonthWaterService = async (user, monthOffset) => {
  const { month, year } = calculateRelativeMonth(monthOffset);
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
        _id: { $dateToString: { format: "%d, %B", date: "$date" } },
        dailyWaterRate: { $first: "$user.waterRate" },
        totalWaterConsumed: { $sum: "$waterVolume" },
        entries: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        dailyWaterRate: $concat[({ $toString: "$dailyWaterRate" }, " L")],
        percentage: {
          $concat: [
            {
              $toString: {
                $multiply: [
                  { $divide: ["$totalWaterConsumed", "$dailyWaterRate"] },
                  100,
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

  // const waterInfo = await WaterNote.aggregate([
  //   {
  //     $match: {
  //       user,
  //       date: { $gte: startDate, $lte: endDate },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: { $dateToString: { format: "%d, %B", date: "$date" } },
  //       totalWaterConsumed: { $sum: "$waterVolume" },
  //       entries: { $sum: 1 },
  //     },
  //   },
  // ]);

  // const { waterRate } = await User.findOne({ _id: user }, { waterRate: 1 });

  // return waterInfo.map(({ _id, totalWaterConsumed, entries }) => {
  //   const percentage =
  //     ((totalWaterConsumed / waterRate) * 100).toFixed(2) + "%";

  //   return {
  //     date: _id,
  //     dailyWaterRate: `${waterRate} L`,
  //     percentage,
  //     entries,
  //   };
  // });
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
  const editedRecord = WaterNote.findOne({ _id: record, user });
  handleNotFoundId();

  const { waterVolume, date } = newData;
  const dateWithUserTimeIso = formatTimeToIso(date);

  editedRecord.waterVolume = waterVolume;
  editedRecord.date = dateWithUserTimeIso;
  editedRecord.markModified("date");
  return await editedRecord.save();
};

const deleteWaterService = async (user, record) => {
  const recordToDelete = await WaterNote.findOneAndDelete({
    _id: record,
    user,
  });
  handleNotFoundId();
  return recordToDelete;
};

const calculateRelativeMonth = (monthOffset) => {
  const currentDate = new Date();
  const currentMonth = getMonth(currentDate);

  let targetDate =
    monthOffset > 0
      ? addMonths(currentDate, monthOffset - currentMonth)
      : subMonths(currentDate, Math.abs(monthOffset));

  let targetMonth = getMonth(targetDate);
  let targetYear = getYear(targetDate);

  if (targetMonth < 0) {
    targetMonth += 12;
    targetYear -= 1;
  } else if (targetMonth > 11) {
    targetMonth -= 12;
    targetYear += 1;
  }
  return { month: targetMonth + 1, year: targetYear };
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
