const jwt = require('jsonwebtoken');
const Users=require("../models/userModel");

async function auth(req, res, next) {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Access denied, Authorization header missing' });
  }

  const headerParts = authorizationHeader.split(' ');

  if (headerParts.length !== 2 || headerParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Access denied, invalid Authorization header format' });
  }

  const token = headerParts[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied, token missing' });
  } else {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = payload.id;
      const _id= payload.id;
      const loggedInUser=await Users.findById(_id).select(["_id","username"]);
      req.user=loggedInUser;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Access denied, token invalid' });
    }
  }
}

module.exports = auth;