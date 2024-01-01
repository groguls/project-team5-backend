const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { preUpdateHook, handleSaveError } = require("./hooks");

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const genderList = ["girl", "man"];

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [32, "Name must be max 32 characters long"],
    },
    email: {
      type: String,
      match: [emailRegExp, "Invalid email format"],
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
      minLength: [8, "Password must be at least 8 characters long"],
      maxLength: [64, "Password must be max 64 characters long"],
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

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdateHook);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

module.exports = {
  User,
};
