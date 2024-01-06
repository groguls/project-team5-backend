const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { preUpdateHook } = require("./hooks");

const waterSchema = new Schema(
  {
    waterVolume: {
      type: Number,
      required: [true, "Enter the value of the water used"],
      min: [1, "Values in the range 1 to 5000"],
      max: [5000, "Values in the range 1 to 5000"],
    },
    date: {
      type: Date,
      required: [true, "Set recording time"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      reqiured: true,
    },
  },
  { versionKey: false }
);

waterSchema.pre("findOneAndUpdate", preUpdateHook);

const addWaterSchema = Joi.object({
  waterVolume: Joi.number().integer().positive().max(5000).required().messages({
    "any.required": "missing required {#label} field",
    positive: "positive values between 1 and 5000 are allowed",
    max: "positive values between 1 and 5000 are allowed",
  }),
  date: Joi.string()
    .regex(/^\d{2}:\d{2}$/)
    .required()
    .messages({
      "any.required": "missing required {#label} field",
      "string.pattern.base": "Invalid time format. 'HH:mm' expected",
    }),
}).and("waterVolume", "date");

const editWaterSchema = Joi.object({
  waterVolume: addWaterSchema.extract("waterVolume"),
  date: addWaterSchema.extract("date"),
}).or("waterVolume", "date");

const WaterNote = model("waterNote", waterSchema);

module.exports = {
  WaterNote,
  addWaterSchema,
  editWaterSchema,
};
