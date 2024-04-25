const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get JWT token from cookie
  const token = req.cookies.jwt;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Attach decoded user ID to req.user._id
    req.user = {
      _id: decoded.userId
    };

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;
