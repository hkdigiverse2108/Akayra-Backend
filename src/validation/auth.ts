import Joi from "joi";

export const phoneSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.number(),
  Joi.object({
    countryCode: Joi.string().optional(),
    phoneNo: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  })
);

export const signupSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  profilePhoto: Joi.string().optional(),
  password: Joi.string().required(),
  contact: phoneSchema.optional(),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
})

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
})

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  password: Joi.string().min(6).required(),
})

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
})
