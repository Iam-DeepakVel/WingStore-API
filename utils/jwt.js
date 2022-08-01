const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10d" });
  return token;
};

//Used for cheking whether the token is valid - authentication
const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

//Used in Register and Login Routes
const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  const TenDays = 1000 * 60 * 60 * 24 * 10;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + TenDays),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = { attachCookiesToResponse, isTokenValid, createJWT };
