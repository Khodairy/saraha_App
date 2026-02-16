import {
  GenerateToken,
  VerifyToken,
} from "../../common/utils/token.service.js";
import * as db_services from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";

export const authentication = async (req, res, next) => {
  // const { id } = req.params;

  const { authorization } = req.headers;

  if (!authentication) {
    throw new Error("token not exist");
  }

  const [prefix, token] = authorization.split(" ");
  if (prefix !== "bearer") {
    throw new Error("invalid token prefix");
  }
  const decode = VerifyToken({ token, secret_key: "Kodairy" });

  if (!decode || !decode?.id) {
    throw new Error("invalid token");
  }

  const user = await db_services.findOne({
    model: userModel,
    filter: { _id: decode.id },
    select: "-password",
  });

  if (!user) {
    throw new Error("user not exist", {
      cause: 404,
    });
  }

  req.user = user;
  next();
};
