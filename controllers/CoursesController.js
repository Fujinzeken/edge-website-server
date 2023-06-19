const Courses = require("../models/CourseModel");
const UserModel = require("../models/UserModel");

module.exports.createCourse = async (req, res) => {
  if (req.user.role === "instructor" || req.user.isAdmin) {
    try {
      const instrcutorName = req.user.firstName + " " + req.user.lastName;
      const { title, image, category } = req.body;
      const newCourse = new Courses({
        title: title,
        image: image,
        category: category,
        instructor: instrcutorName,
      });

      // fetch user with userid and store course id
      await UserModel.findByIdAndUpdate(
        req.user.id,
        { $push: { courses: newCourse._id } },
        { new: true, upsert: true }
      );
      const savedCourse = await newCourse.save();
      res.status(200).json(savedCourse);
    } catch (err) {
      res.json({ msg: `${err.message}` });
    }
  } else {
    res.status(401).json("You must be an instructor to create courses");
  }
};

module.exports.getCourses = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const courses = await Courses.find({}).populate("videos");
      if (courses.length < 1)
        return res.json({ msg: "No courses created yet" });
      res.status(200).json(courses);
    } catch (err) {
      res.json(`${err.message}`);
    }
  } else {
    res.status(401).json("You are unathorized, Only admins can view this page");
  }
};

module.exports.getOneCourse = async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id).populate("videos");
    res.status(200).json(course);
  } catch (err) {
    res.status(401).json(`An error has occured, please try again`);
  }
};

module.exports.updateCourse = async (req, res) => {
  const id = req.params.id;
  const user = req.user.firstName + " " + req.user.lastName;
  try {
    const course = await Courses.findById(id);
    if (!course)
      return res.json({
        msg: "This course does not exist or has been deleted",
      });
    if (req.user.isAdmin || user === course.instructor) {
      const updatedCourse = await Courses.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedCourse);
    }
  } catch (err) {
    res.status(401).json(`An error has occured, please try again`);
  }
};

module.exports.deleteCourse = async (req, res) => {
  const id = req.params.id;
  const user = req.user.firstName + " " + req.user.lastName;
  try {
    const course = await Courses.findById(id);
    if (!course)
      return res.json({
        msg: "This course does not exist or has been deleted",
      });

    if (req.user.isAdmin || user === course.instructor) {
      await UserModel.findByIdAndUpdate(req.user.id, {
        $pullAll: { courses: [{ _id: course.id }] },
      });
      await Courses.findByIdAndDelete(id);
      res.status(200).json({ msg: "This couse has been deleted" });
    }
  } catch (err) {
    res.status(401).json(`An error has occured, please try again`);
  }
};
