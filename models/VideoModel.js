const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnail: { type: String },
  desc: { type: String },
  instructor: { type: String },
  videoUrl: { type: String, required: true },
});

module.exports = mongoose.model("Videos", VideoSchema);
