import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";

const checkConnection = async () => {
  await mongoose
    .connect(DB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log("DB connected successfully.....😍");
    })
    .catch((error) => {
      console.log("DB connected Failed.....😢");
    });
};

export default checkConnection;
