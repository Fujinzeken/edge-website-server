const Courses = require("../models/CourseModel");
const Video = require("../models/VideoModel");

module.exports.createVideo = async (req, res) => {
  if (req.user.role === "instructor" || req.user.isAdmin) {
    try {
      const instructor = req.user.firstName + " " + req.user.lastName;
      const { title, thumbnail, desc, videoUrl } = req.body;
      const newVid = new Video({
        title,
        thumbnail,
        desc,
        videoUrl,
        instructor,
      });

      // fetch course with couserid and store video id
      await Courses.findByIdAndUpdate(
        req.courseId,
        { $push: { videos: newVid._id } },
        { new: true, upsert: true }
      );
      const savedVid = await newVid.save();
      res.status(200).json(savedVid);
    } catch (err) {
      res.json({ msg: `${err.message}` });
    }
  } else {
    res.status(401).json("You must be an instructor to create courses");
  }
};

module.exports.getVideos = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const vids = await Video.find({});
      if (vids.length < 1)
        return res.json({ msg: "There are no vidoes uploaded yet" });
      res.status(200).json(vids);
    } catch (err) {
      res.json(`${err.message}`);
    }
  } else {
    res.status(401).json("You are unathorized, Only admins can view this page");
  }
};

module.exports.getOneVideo = async (req, res) => {
  try {
    const vid = await Video.findById(req.params.id);
    if (!vid)
      return res.json({ msg: "This video does not exist or has been deleted" });
    res.status(200).json(vid);
  } catch (err) {
    res.status(401).json(`An error has occured, please try again`);
  }
};

module.exports.updatevideo = async (req, res) => {
  const id = req.params.id;
  const user = req.user.firstName + " " + req.user.lastName;
  try {
    const vid = await Video.findById(id);
    if (!vid)
      return res.json({
        msg: "This video does not exist or has been deleted",
      });
    if (req.user.isAdmin || user === vid.instructor) {
      const updatedVid = await Video.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedVid);
    }
  } catch (err) {
    res.status(401).json(`An error has occured, please try again`);
  }
};

module.exports.deleteVideo = async (req, res) => {
  const id = req.params.id;
  const user = req.user.firstName + " " + req.user.lastName;
  try {
    const vid = await Video.findById(id);
    if (!vid)
      return res.json({
        msg: "This course does not exist or has been deleted",
      });
    if (req.user.isAdmin || user === vid.instructor) {
      await Courses.findByIdAndUpdate(req.params.courseId, {
        $pullAll: { videos: [{ _id: vid.id }] },
      });

      await Video.findByIdAndDelete(id);
      res.status(200).json({ msg: "Video has been deleted" });
    }
  } catch (err) {
    res.status(401).json(`An error has occured, please try again`);
  }
};
