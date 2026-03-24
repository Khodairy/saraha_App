import Joi from "joi";
import {
  genderEnum,
  providerEnum,
  roleEnum,
} from "../../common/enum/user.enum.js";
import { general_rules } from "../../common/utils/generalRules.js";

export const signUp_Schema = {
  body: Joi.object({
    userName: Joi.string().min(3).max(30).required(),

    email: general_rules.email.required(),

    password: general_rules.password.required(),

    phone: Joi.string()
      .pattern(/^01[0125][0-9]{8}$/)
      .required(),

    age: Joi.number().integer().min(15).max(80).required(),

    gender: Joi.string()
      .valid(genderEnum.male, genderEnum.female)
      .default(genderEnum.male)
      .required(),

    provider: Joi.string()
      .valid(providerEnum.system, providerEnum.google)
      .default(providerEnum.system),

    role: Joi.string()
      .valid(roleEnum.user, roleEnum.admin)
      .default(roleEnum.user)
      .required(),

    profilePic: Joi.string().allow(""),
    coverPic: Joi.string().allow(""),

    confirmed: Joi.boolean().default(false),
  }).required(),

  // file: general_rules.file.required(),
  // files: Joi.array().items(general_rules.file.required()).required(),

  files: Joi.object({
    attachment: Joi.array().items(general_rules.file).required(),
    attachments: Joi.array().max(3).items(general_rules.file).required(),
  }).required(),
};

export const signUpWithGmail_Schema = {
  body: Joi.object({
    idToken: Joi.string().required(),
  }),
};

export const signIn_Schema = {
  body: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: ["com", "net", "org"] } })
      .required(),

    password: Joi.string().min(6).max(20).required(),
  }),
};

export const shareProfile_Schema = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }).required(),
};

export const updateProfile_Schema = {
  body: Joi.object({
    firstName: Joi.string().trim().min(5),
    lastName: Joi.string().trim().min(5),
    gender: Joi.string().valid(...Object.values(genderEnum)),
    phone: Joi.string(),
  }).required(),
};

export const updatePasswordSchema = {
  body: Joi.object({
    newPassword: general_rules.password.required(),
    cPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
      "any.only": "Confirmation password must match new password",
    }),
    oldPassword: general_rules.password.required(),
  }).required(),
};
