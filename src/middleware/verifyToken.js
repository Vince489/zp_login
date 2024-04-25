const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and extract user ID
const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);
  console.log(process.env.TOKEN_KEY);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;