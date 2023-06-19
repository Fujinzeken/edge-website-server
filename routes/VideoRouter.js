const router = require("express").Router();
const {
  getVideos,
  getOneVideo,
  createVideo,
  updatevideo,
  deleteVideo,
} = require("../controllers/VideoController");
const verify = require("../validator");

router.get("/:courseId/video", verify, getVideos);
router.get("/:courseId/video/:id", verify, getOneVideo);
router.post("/:courseId/video/create", verify, createVideo);
router.patch("/:courseId/video/update/:id", verify, updatevideo);
router.delete("/:courseId/video/delete/:id", verify, deleteVideo);

module.exports = router;
