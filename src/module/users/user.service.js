import { providerEnum } from "../../common/enum/user.enum.js";
import { successResponse } from "../../common/utils/response.success.js";
import {
  decrypt,
  encrypt,
} from "../../common/utils/security/encrypt.security.js";
import { compare, hash } from "../../common/utils/security/hash.security.js";
import {
  GenerateToken,
  VerifyToken,
} from "../../common/utils/token.service.js";
import * as db_services from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const signUp = async (req, res, next) => {
  const {
    userName,
    email,
    password,
    phone,
    age,
    gender,
    provider,
    profilePic,
    confirmed,
  } = req.body;

  if (userName.split(" ").length < 2) {
    throw new Error("user name must be consist of first name & last name", {
      cause: 400,
    });
  }

  const emailExist = await db_services.findOne({
    model: userModel,
    filter: { email },
  });

  if (emailExist) {
    throw new Error("Email is already existing before", {
      cause: 409,
    });
  }

  const user = await db_services.create({
    model: userModel,
    data: {
      userName,
      email,
      password: await hash({ plainText: password }),
      phone: encrypt(phone),
      age,
      gender,
      provider,
      profilePic,
      confirmed,
    },
  });

  return successResponse({
    res,
    status: 201,
    message: "New user has been created successfully",
    data: user,
  });
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await db_services.findOne({
    model: userModel,
    filter: { email, provider: providerEnum.system },
  });

  if (!user) {
    throw new Error("user not exist", {
      cause: 404,
    });
  }

  const match = compare({ plainText: password, cipherText: user.password });
  if (!match) {
    throw new Error("invalid password", {
      cause: 400,
    });
  }

  const access_token = GenerateToken({
    payload: { id: user._id, email: user.email },
    secret_key: "Kodairy",
    options: {
      expiresIn: "1h",
      noTimestamp: true,
      // issuer: "http://localhost:5000",
      // audience: "http://localhost:3000",
      // notBefore: 60 * 60,
      jwtid: uuidv4(),
    },
  });

  return successResponse({
    res,
    message: "user loged successfully",
    data: { name: user.userName, email: user.email, token: access_token },
  });
};

export const getProfile = async (req, res, next) => {
  const user = req.user;
  return successResponse({
    res,
    message: "Retrive user successfully",
    data: { ...user._doc, phone: decrypt(user.phone) },
  });
};
