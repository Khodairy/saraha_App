import { PREFIX, SECRET_KEY } from "../../../config/config.service.js";
import {
  GenerateToken,
  VerifyToken,
} from "../../common/utils/token.service.js";
import * as db_services from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";

export const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(new Error("token not exist", { cause: 400 }));
    }

    const [prefix, token] = authorization.split(" ");
    if (!prefix || !token || prefix.toLowerCase() !== PREFIX.toLowerCase()) {
      return next(new Error("invalid token prefix", { cause: 400 }));
    }

    const decode = VerifyToken({ token, secret_key: SECRET_KEY });

    if (decode instanceof Error || decode.message) {
      return next(new Error(`Token Error: ${decode.message}`, { cause: 401 }));
    }

    if (!decode || !decode.id) {
      return next(new Error("invalid token payload", { cause: 401 }));
    }

    const user = await db_services.findOne({
      model: userModel,
      filter: { _id: decode.id },
      select: "-password",
    });

    if (!user) {
      return next(new Error("user not exist", { cause: 404 }));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};
