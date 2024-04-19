const jwt = require('jsonwebtoken');
const { TOKEN_KEY } = process.env;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = req.cookies.token || authHeader && authHeader.split(' ')[1];


  if (token == null) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, TOKEN_KEY, (err, gamer) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    // Attach the authenticated user to the request for later use    
    req.gamer = gamer;
    next();
  });
}; 

module.exports = authenticateToken;
