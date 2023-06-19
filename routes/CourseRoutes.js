const router = require("express").Router();
const {
  getCourses,
  getOneCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/CoursesController");
const verify = require("../validator");

router.get("/", verify, getCourses);
router.get("/:id", verify, getOneCourse);
router.post("/create", verify, createCourse);
router.patch("/update/:id", verify, updateCourse);
router.delete("/delete/:id", verify, deleteCourse);

module.exports = router;
