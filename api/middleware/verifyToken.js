const jwt = require("jsonwebtoken");
//verify token middleware

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "token is invalid" });
    }
    req.decoded = decoded;
    next();
  });
};

module.exports = verifyToken;
