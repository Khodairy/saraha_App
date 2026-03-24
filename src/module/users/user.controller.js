import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.schema.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { roleEnum } from "../../common/enum/user.enum.js";
import { Validation } from "../../common/middleware/validations.js";
import { multer_enum } from "../../common/enum/multer.enum.js";
import { multer_local } from "../../common/middleware/multer.js";

const userRouter = Router();

// ========================== post =========================

userRouter.post(
  "/signup",
  multer_local({
    custom_path: "users",
    custom_types: [...multer_enum.image],
  }).fields([
    {
      name: "attachment",
      maxCount: 1,
    },
    {
      name: "attachments",
      maxCount: 2,
    },
  ]),
  Validation(UV.signUp_Schema),
  US.signUp,
);

userRouter.post(
  "/signup/gmail",
  Validation(UV.signUpWithGmail_Schema),
  US.signUp_withGmail,
);

userRouter.post("/signin", Validation(UV.signIn_Schema), US.signIn);
userRouter.post("/refresh_token", US.refresh_token);

// ========================== get =========================

userRouter.get(
  "/profile",
  authentication,
  authorization([roleEnum.admin]),
  US.getProfile,
);

userRouter.get(
  "/share-profile/:id",
  Validation(UV.shareProfile_Schema),
  US.shareProfile,
);

// ========================== patch =========================
userRouter.patch(
  "/update-profile",
  authentication,
  Validation(UV.updateProfile_Schema),
  US.updateProfile,
);

userRouter.patch(
  "/update-password",
  authentication,
  Validation(UV.updatePasswordSchema),
  US.updatePassword,
);

export default userRouter;
