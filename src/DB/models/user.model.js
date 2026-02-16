import mongoose from "mongoose";
import { genderEnum, providerEnum } from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, minLength: 3 },
    lastName: { type: String, required: true, trim: true, minLength: 3 },
    email: { type: String, unique: true, required: [true, "email not found"] },
    password: { type: String, required: [true, "Password not found"] },
    phone: { type: String, required: [true, "Phone not found"] },
    age: { type: Number, min: 18, max: 60 },
    gender: {
      type: String,
      enum: Object.values(genderEnum),
      default: genderEnum.male,
    },
    provider: {
      type: String,
      enum: Object.values(providerEnum),
      default: providerEnum.system,
    },
    profilePic: String,
    confirmed: Boolean,
  },
  {
    strict: true,
    // autoCreate: true,
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
  },
);

userSchema
  .virtual("userName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (v) {
    const [firstName, lastName] = v.split(" ");
    this.set({ firstName, lastName });
  });

// import userModel from "./DB/models/user.model.js";
// import userModel from "./DB/models/User.model.js";

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
