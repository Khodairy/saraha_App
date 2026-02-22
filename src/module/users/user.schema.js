import Joi from "joi";
import {
  genderEnum,
  providerEnum,
  roleEnum,
} from "../../common/enum/user.enum.js";

export const signUp_Schema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),

  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org"] } })
    .required(),

  password: Joi.string().min(6).max(20).required(),

  phone: Joi.string().pattern(/^01[0125][0-9]{8}$/),

  age: Joi.number().integer().min(15).max(80),

  gender: Joi.string()
    .valid(genderEnum.male, genderEnum.female)
    .default(genderEnum.male),

  provider: Joi.string()
    .valid(providerEnum.system, providerEnum.google)
    .default(providerEnum.system),

  role: Joi.string()
    .valid(roleEnum.user, roleEnum.admin)
    .default(roleEnum.user),

  profilePic: Joi.string().allow(""),

  confirmed: Joi.boolean().default(false),
});

export const signUpWithGmail_Schema = Joi.object({
  idToken: Joi.string().required(),
});

export const signIn_Schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org"] } })
    .required(),

  password: Joi.string().min(6).max(20).required(),
});
