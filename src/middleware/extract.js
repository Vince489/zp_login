const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

const extractGamerIdFromToken = (req, res, next) => {
  // Check if the request contains a token
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  // Verify the token and extract gamer ID
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.gamerId = decoded.gamer._id;
    next();
  });
};

module.exports = extractGamerIdFromToken;
