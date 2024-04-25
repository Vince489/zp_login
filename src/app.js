const connectToDB = require("./config/db"); // Require the db.js file

const express = require("express");
const cookieParser = require('cookie-parser');
const routes = require("./routes");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "zprompter.com", "https://zprompter.netlify.app", "virtronboxing.club", "https://virtronboxing.club", "zprompter.netlify.app", "https://virtron-beta.netlify.app"],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1", routes);

// Connect to the database
connectToDB();

module.exports = app;
