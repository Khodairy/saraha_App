import { providerEnum } from "../../common/enum/user.enum.js";
import { successResponse } from "../../common/utils/response.success.js";
import * as db_services from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";

export const signUp = async (req, res, next) => {
  const {
    userName,
    email,
    password,
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
      password,
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

  if (password !== user.password) {
    throw new Error("invalid password", {
      cause: 400,
    });
  }

  return successResponse({
    res,
    message: "user loged successfully",
    data: { name: user.userName, email: user.email },
  });
};
