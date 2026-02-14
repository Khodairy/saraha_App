import express from "express";
import checkConnection from "./DB/connectDB.js";
import userRouter from "./module/users/user.controller.js";
const app = express();
let port = 5000;

const bootstrap = () => {
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

  app.listen(port, () => {
    console.log(`Server Running in port ${port}...😜`);
  });
};
export default bootstrap;
