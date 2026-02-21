import express from "express";
import checkConnection from "./DB/connectDB.js";
import userRouter from "./module/users/user.controller.js";
import cors from "cors";
import { PORT } from "../config/config.service.js";

const app = express();

const bootstrap = () => {
  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res, next) => {
    res.status(200).json({ message: "Welcome in SARAHA APP.....😍" });
  });

  app.use("/users", userRouter);
  checkConnection();
  app.use("{/*demo}", (req, res, next) => {
    throw new Error(`404 URL ${req.originalUrl} not found.....🫣`, {
      cause: 404,
    });
  });

  app.use((err, req, res, next) => {
    res
      .status(err.cause || 500)
      .json({ message: err.message, stack: err.stack });
  });

  app.listen(PORT, () => {
    console.log(`Server Running in port ${PORT}...😜`);
  });
};
export default bootstrap;
