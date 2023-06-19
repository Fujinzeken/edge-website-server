const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  instructor: { type: String, required: true },
  category: { type: String, required: true },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Videos" }],
});
module.exports = mongoose.model("Courses", CourseSchema);

// CourseSchema.pre('findOneAndDelete', async(next)=>{

// })
