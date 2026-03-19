const jsonwebtoken = require("jsonwebtoken");

const createToken = (user) => {
  const payload = { id: user.id, email: user.email };
  return jsonwebtoken.sign(payload, process.env.JWT_SECRET || "secret_key", {
    expiresIn: "24h",
  });
};

module.exports = { createToken };
