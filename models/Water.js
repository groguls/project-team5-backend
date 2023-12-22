const { Schema, model } = require("mongoose");
const Joi = require("joi");

const waterSchema = new Schema(
  {
    amount: {
      type: Number,
      required: [true, "Enter the value of the water used"],
      min: [0, "Values in the range 0 to 5000"],
      max: [5000, "Values in the range 0 to 5000"],
    },
    recordingTime: {
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

const Water = model("water", waterSchema);

module.exports = {
  Water,
};
