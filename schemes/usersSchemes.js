const Joi = require("joi");

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const genderList = ["Girl", "Man"];

const userSignupSchema = Joi.object({
  name: Joi.string().min(2).max(40).messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must be max 40 characters long",
  }),
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

const userSigninSchema = Joi.object({
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

const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(40).messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must be max 40 characters long",
  }),
  email: Joi.string().pattern(emailRegExp).messages({
    "string.pattern.base": "Invalid email format",
  }),
  password: Joi.string().min(8).max(64).messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be max 64 characters long",
  }),
  gender: Joi.string(),
});

module.exports = {
  userSignupSchema,
  userSigninSchema,
  userUpdateSchema,
};
