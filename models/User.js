const { Schema, model } = require("mongoose");
const Joi = require("joi");

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const genderList = ["Girl", "Man"];

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
      minLength: [8, "Password must be at least 6 characters long"],
      maxLength: [48, "Password must be max 48 characters long"],
    },
    email: {
      type: String,
      match: [emailRegExp, "Invalid email format"],
      required: [true, "Email is required"],
      unique: true,
    },
    gender: {
      type: String,
      enum: genderList,
    },
    token: { type: String, default: null },
    avatarURL: { type: String },
    waterRate: {
      type: Number,
      min: [0, "Values in the range 0 to 15000"],
      max: [15000, "Values in the range 0 to 15000"],
      default: 2000,
    },
  },
  { versionKey: false }
);

const User = model("user", userSchema);

module.exports = {
  User,
};
