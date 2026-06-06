const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getUserByToken = async (token, res) => {
  if (!token) {
    res.status(422).json({
      message: "Acesso negado!",
    });
  }

  const decoded = jwt.verify(token, "JWT_token");
  const userId = decoded.id;
  const user = await User.findOne({ _id: userId });

  return user;
};

module.exports = getUserByToken;
