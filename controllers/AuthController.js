const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  const { email, password, firstName, lastName, isAdmin } = req.body;
  try {
    const emailExist = await UserModel.findOne({ email });
    if (emailExist) return res.json({ msg: "This user already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = new UserModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      isAdmin: isAdmin,
    });
    const savedUser = await newuser.save();
    const accessToken = jwt.sign({ id: savedUser._id }, process.env.jwtSecret, {
      expiresIn: "1d",
    });
    res.status(200).json({ savedUser, accessToken });
  } catch (err) {
    res.json({ msg: `${err.message}` });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await UserModel.findOne({ email: email });
    if (!foundUser) return res.json({ msg: "Email does not exist" });

    const checkedPassword = await bcrypt.compare(password, foundUser.password);
    if (checkedPassword) {
      const { password, ...info } = foundUser._doc;
      const accessToken = jwt.sign(
        { id: foundUser._id, isAdmin: foundUser.isAdmin },
        process.env.jwtSecret,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        msg: `welcome back ${foundUser.firstName} ${foundUser.lastName}`,
        ...info,
        accessToken,
      });
    } else {
      res.json({ msg: "Password is incorrect" });
    }
  } catch (err) {
    res.json({ msg: `${err.message}` });
  }
};
