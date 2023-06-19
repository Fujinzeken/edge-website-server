const jwt = require("jsonwebtoken");
const UserModel = require("./models/UserModel");

function verify(req, res, next) {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.jwtSecret, async (err, user) => {
      if (err || user == null) return res.json({ msg: `Token has expired ` });
      else {
        const newUser = await UserModel.findById(user.id);
        if (!newUser) return res.json({ msg: "please log in again" });
        req.user = newUser;
        next();
      }
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
}

module.exports = verify;
