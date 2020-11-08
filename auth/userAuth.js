const jwt = require("jsonwebtoken");

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) throw new Error("Unauthorized, token missing");

  const token = authHeader.split("Bearer ")[1];
  if (!token)
    throw new Error(
      "Authorization header should be like 'Bearer <your-token>'"
    );
  return jwt.verify(token, process.env.JWT_SECRET);
};
