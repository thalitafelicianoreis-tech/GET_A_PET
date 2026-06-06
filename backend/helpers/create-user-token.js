const jwt = require("jsonwebtoken");

const userCreateToken = async (user, req, res, message) => {
  //create token
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    "JWT_token",
  );

  //return token

  res.status(200).json({
    message,
    token: token,
    userId: user._id,
  });
};

module.exports = userCreateToken;
