const mongoose = require("mongoose");
const { Courses } = require("./CourseModel");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "Please enter a firstName"] },
  lastName: { type: String, required: [true, "Please enter a lastName"] },
  email: {
    type: String,
    required: [true, "Please enter a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    min: [8, "Password must not be less than 8"],
  },
  isAdmin: { type: Boolean, default: false },
  role: { type: String, default: "user" },
  courses: [{ type: mongoose.Types.ObjectId, ref: "Courses" }],
});

module.exports = mongoose.model("User", UserSchema);
