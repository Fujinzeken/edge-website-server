const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const authRouter = require("./routes/AuthRouter");
const userRouter = require("./routes/UserRoutes");
const courseRouter = require("./routes/CourseRoutes");
const videoRouter = require("./routes/VideoRouter");
dotenv.config();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/edgeDB")
  .then(() => {
    console.log("DB connected Successfully");
  })
  .catch((err) => console.log(err));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/courses", courseRouter);
app.use("/course", videoRouter);
app.listen(process.env.PORT || 4000, () => {
  console.log("Server started successfully");
});
