const {
  getAll,
  get,
  update,
  deleteUser,
} = require("../controllers/UserController");

const verify = require("../validator");

const router = require("express").Router();

router.get("/", verify, getAll);
router.get("/:id", verify, get);
router.patch("/:id", verify, update);
router.delete("/:id", verify, deleteUser);

module.exports = router;
