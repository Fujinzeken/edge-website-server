const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

module.exports.getAll = async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await UserModel.find({}).sort({ _id: -1 }).limit(20)
        : await UserModel.find({});
      res.status(200).json(users);
    } catch (err) {
      res.json({ msg: `${err.msg}` });
    }
  } else {
    res.status(401).json({ msg: "You are unauthorized" });
  }
};

module.exports.get = async (req, res) => {
  id = req.params.id;
  if (id === req.user.id || req.user.isAdmin) {
    try {
      const user = await UserModel.findById(id);
      user.password = undefined;
      res.status(200).json(user);
    } catch (err) {
      res.json({ msg: `${err.message}, could not find user` });
    }
  } else {
    res.status(403).json("Please login to view account");
  }
};

module.exports.update = async (req, res) => {
  id = req.params.id;
  if (id === req.user.id) {
    try {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(password, 10);
      }
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.json({
        msg: "Ooops!!, Something went wrong with user update, please try again",
      });
    }
  } else {
    res.status(403).json("You can only update your own account");
  }
};

module.exports.deleteUser = async (req, res) => {
  if (req.params.id === req.user.id || req.user.isAdmin) {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "User has been deleted" });
    } catch (err) {
      res.json({ msg: `${err.message}` });
    }
  } else {
    res.status(403).json("You can only delete your own account");
  }
};
