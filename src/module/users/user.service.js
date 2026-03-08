import { providerEnum } from "../../common/enum/user.enum.js";
import { successResponse } from "../../common/utils/response.success.js";
import {
  decrypt,
  encrypt,
} from "../../common/utils/security/encrypt.security.js";
import { compare, hash } from "../../common/utils/security/hash.security.js";
import { GenerateToken } from "../../common/utils/token.service.js";
import * as db_services from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import { OAuth2Client } from "google-auth-library";
import { SECRET_KEY } from "../../../config/config.service.js";
import cloudinary from "../../common/utils/cloudinary.js";

export const signUp = async (req, res, next) => {
  const {
    userName,
    email,
    password,
    phone,
    age,
    gender,
    provider,
    role,
    profilePic,
    coverPic,
    confirmed,
  } = req.body;

  const coverPicUrls = [];
  if (req.files?.attachments?.length > 0) {
    for (const file of req.files.attachments) {
      const upload = await cloudinary.uploader.upload(file.path, {
        folder: `sarahaApp/users/${email}/covers`,
        // public_id: "khodairy",
        use_filename: true,
        unique_filename: false,
        resource_type: "image", // default
      });
      coverPicUrls.push({
        secure_url: upload.secure_url,
        public_id: upload.public_id,
      });
    }
  }
  let profileData = {};
  if (req.files?.attachment?.[0]) {
    const upload = await cloudinary.uploader.upload(
      req.files.attachment[0].path,
      {
        folder: `sarahaApp/users/${email}/profile`,
      },
    );
    profileData = {
      secure_url: upload.secure_url,
      public_id: upload.public_id,
    };
  }

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
      role,
      profilePic: profileData,
      coverPic: coverPicUrls,
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

export const signUp_withGmail = async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new Error("idToken is required", { cause: 400 }));
  }

  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience:
      "99890981485-jrovhrvatrnm9iqj2k8brq2lvos8jp0c.apps.googleusercontent.com",
  });
  const payload = ticket.getPayload();
  console.log(payload);
  let { name, email, email_verified, picture } = payload;

  let user = await db_services.findOne({
    model: userModel,
    filter: { email },
  });

  if (!user) {
    user = await db_services.create({
      model: userModel,
      data: {
        userName: name,
        email,
        provider: providerEnum.google,
        profilePic: picture,
        confirmed: email_verified,
      },
    });
  }

  if (user.provider == providerEnum.system) {
    throw new Error("Please login from system", { cause: 400 });
  }

  const access_token = GenerateToken({
    payload: { id: user._id, email: user.email },
    secret_key: SECRET_KEY,
    options: {
      expiresIn: "1h",
      noTimestamp: true,
      jwtid: uuidv4(),
    },
  });

  return successResponse({
    res,
    message: "user logup successfully",
    data: { name: user.userName, email: user.email, token: access_token },
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
    secret_key: SECRET_KEY,
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
