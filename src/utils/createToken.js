const jwt = require("jsonwebtoken");

const { TOKEN_KEY, TOKEN_EXPIRY } = process.env;

const createToken = async (
  tokenData,
  tokenKey = TOKEN_KEY || "defaultTokenKey",
  // expiresIn = TOKEN_EXPIRY || "1h"
) => {
  return jwt.sign(tokenData, tokenKey);
};

module.exports = createToken;
