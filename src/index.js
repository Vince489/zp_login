require("dotenv").config();
// require("express-async-errors");
const app = require("./app");

const {PORT}  = process.env || 3000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
