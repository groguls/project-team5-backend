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
    tempConfirmationToken: { type: String, default: null },
  },
  { versionKey: false }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdateHook);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

const userAuthSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required().messages({
    "any.required": "Missing required email field",
    "string.pattern.base": "Invalid email format",
  }),
  password: Joi.string().min(8).max(64).required().messages({
    "any.required": "Missing required password field",
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be max 64 characters long",
  }),
});

const userSettingsSchema = Joi.object({
  name: Joi.string().min(2).max(32).messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must be max 32 characters long",
  }),
  email: Joi.string().pattern(emailRegExp).messages({
    "string.pattern.base": "Invalid email format",
  }),
  oldPassword: Joi.string().min(8).max(64).messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be max 64 characters long",
  }),
  newPassword: Joi.string().min(8).max(64).messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be max 64 characters long",
  }),
  gender: Joi.string().valid(...genderList),
});

const userUpdateWaterRateSchema = Joi.object({
  waterRate: Joi.number().min(0).max(150000).required().messages({
    "any.required": "Missing required waterRate field",
    "number.min": "Values in the range 0 to 15000",
    "number.max": "Values in the range 0 to 15000",
  }),
});

const userConfirmationEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required().messages({
    "any.required": "Missing required email field",
    "string.pattern.base": "Invalid email format",
  }),
});

const userChangePasswordSchema = Joi.object({
  newPassword: Joi.string().required().min(8).max(64).messages({
    "any.required": "Missing required password field",
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be max 64 characters long",
  }),
});

module.exports = {
  User,
  userAuthSchema,
  userSettingsSchema,
  userUpdateWaterRateSchema,
  userConfirmationEmailSchema,
  userChangePasswordSchema,
};
