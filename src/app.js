require("./config/db");
require("dotenv").config();

const express = require("express");
const routes = require("./routes");


const cors = require("cors");
const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "zprompter.com", "https://zprompter.netlify.app", "zprompter.netlify.app"],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/api/v1", routes);


module.exports = app;
